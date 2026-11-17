/*
 * 홈페이지 자동 점검 (계획서 9장 완료 기준 중 자동화 가능 항목)
 * 실행: node homepage/tests/check.js   (저장소 루트 또는 아무 위치에서)
 *
 * 점검 항목
 *  1) 콘솔 에러 / 페이지 에러 0건
 *  2) 화면 텍스트에 "null", "undefined", "[object", "NaN" 미노출
 *  3) 모바일(375px)·데스크톱(1280px)에서 가로 스크롤 없음
 *  4) 모든 img 에 alt 존재
 *  5) 시나리오 A: 실제 content/site.js / 시나리오 B: 모든 항목을 채운 fixture (일부 null 섞음)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const FIXTURE = path.join(__dirname, "fixture-site.js");
const PAGES = ["index", "about", "business", "products", "references", "contact", "privacy"];
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain" };

function serve(useFixture) {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    let file = path.join(ROOT, p);
    if (useFixture && p === "/content/site.js") file = FIXTURE;
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": (TYPES[path.extname(file)] || "application/octet-stream") + "; charset=utf-8" });
    fs.createReadStream(file).pipe(res);
  });
}

async function run(name, useFixture, browser) {
  const server = serve(useFixture);
  await new Promise(r => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const fails = [];
  for (const width of [375, 1280]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await ctx.newPage();
    // 외부 웹폰트는 점검 대상 아님 (오프라인에서도 점검 가능하도록 차단)
    await page.route(/cdn\.jsdelivr\.net/, r => r.abort());
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error" && !/jsdelivr|ERR_FAILED/.test(m.text())) errors.push(m.text()); });
    for (const p of PAGES) {
      errors.length = 0;
      await page.goto(base + p + ".html", { waitUntil: "load" });
      const r = await page.evaluate(() => ({
        text: document.body.innerText,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        noAlt: [...document.images].filter(i => !i.hasAttribute("alt")).length,
        h1: document.querySelectorAll("h1").length,
        header: !!document.querySelector(".logo"),
        footer: !!document.querySelector(".footer-name")
      }));
      const tag = `[${name}] ${p} @${width}px`;
      if (errors.length) fails.push(`${tag}: 에러 ${errors.join(" | ")}`);
      const bad = r.text.match(/\bnull\b|\bundefined\b|\[object|\bNaN\b/);
      if (bad) fails.push(`${tag}: 금지 문자열 노출 "${bad[0]}"`);
      if (r.overflow) fails.push(`${tag}: 가로 스크롤 발생`);
      if (r.noAlt) fails.push(`${tag}: alt 없는 이미지 ${r.noAlt}개`);
      if (r.h1 !== 1) fails.push(`${tag}: h1 개수 ${r.h1}`);
      if (!r.header || !r.footer) fails.push(`${tag}: 헤더/푸터 누락`);
    }
    // 모바일 메뉴 토글 동작
    if (width === 375) {
      await page.goto(base + "index.html");
      const before = await page.isVisible("#gnb");
      await page.click(".nav-toggle");
      const after = await page.isVisible("#gnb");
      if (before || !after) fails.push(`[${name}] 모바일 메뉴 토글 이상 (before=${before}, after=${after})`);
    }
    await ctx.close();
  }
  server.close();
  return fails;
}

(async () => {
  const browser = await chromium.launch();
  const fails = [...await run("실데이터", false, browser), ...await run("fixture", true, browser)];
  await browser.close();
  if (fails.length) { console.log("FAIL\n" + fails.join("\n")); process.exit(1); }
  console.log(`PASS — ${PAGES.length}페이지 × 2해상도 × 2데이터 시나리오`);
})();
