/*
 * window.SITE (content/site.js) → 화면 렌더링
 *
 * 규칙
 * - 화면 문구는 SITE 값 또는 고정 메뉴명/라벨만 사용한다. 회사 정보를 코드에서 만들어내지 않는다.
 * - 빈값(null/undefined/""/[])인 항목은 줄째로 출력하지 않는다.
 * - 목록 페이지의 목록이 비어 있으면 "등록된 정보가 없습니다." 를 명시한다.
 * - 모든 텍스트는 textContent 로만 넣는다 (innerHTML 사용 금지 → 입력값에 의한 HTML 주입 방지).
 */
(function () {
  "use strict";

  var NAV = [
    { href: "about.html", label: "회사소개", page: "about" },
    { href: "business.html", label: "사업분야", page: "business" },
    { href: "products.html", label: "제품·솔루션", page: "products" },
    { href: "references.html", label: "실적", page: "references" },
    { href: "contact.html", label: "문의하기", page: "contact" }
  ];
  var NO_DATA = "등록된 정보가 없습니다.";

  // ---------- 공통 유틸 ----------
  function isEmpty(v) {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.trim() === "";
    if (Array.isArray(v)) return v.length === 0;
    return false;
  }

  // el("p", {class: "x"}, "텍스트" | Node | [자식...]) — 빈 자식은 건너뜀
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
      });
    }
    append(node, children);
    return node;
  }
  function append(node, children) {
    if (children === null || children === undefined) return;
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      if (Array.isArray(c)) { append(node, c); return; } // 중첩 배열(예: paragraphs 결과) 평탄화
      node.appendChild(typeof c === "string" || typeof c === "number"
        ? document.createTextNode(String(c)) : c);
    });
  }

  // 라벨-값 한 줄. 값이 비면 null 반환 → 출력 생략
  function row(label, value, href) {
    if (isEmpty(value)) return null;
    var v = href ? el("a", { href: href }, value) : el("span", null, value);
    return el("li", null, [el("span", { class: "label" }, label), v]);
  }
  function list(items, cls) {
    items = (items || []).filter(Boolean);
    return items.length ? el("ul", { class: cls }, items) : null;
  }
  function paragraphs(arr) {
    if (isEmpty(arr)) return null;
    if (!Array.isArray(arr)) arr = [arr];
    return arr.filter(function (p) { return !isEmpty(p); })
      .map(function (p) { return el("p", null, p); });
  }
  function section(title, body, cls) {
    if (isEmpty(body) || (Array.isArray(body) && !body.filter(Boolean).length)) return null;
    return el("section", { class: "section " + (cls || "") }, el("div", { class: "container" }, [
      title ? el("h2", { class: "section-title" }, title) : null,
      body
    ]));
  }
  function emptyNote() { return el("p", { class: "empty" }, NO_DATA); }
  function pageHead(title) {
    return el("section", { class: "page-head" }, el("div", { class: "container" }, el("h1", null, title)));
  }
  function telHref(t) { return "tel:" + String(t).replace(/[^0-9+]/g, ""); }

  // ---------- 헤더 / 푸터 ----------
  function renderHeader(S, page) {
    var host = document.getElementById("site-header");
    if (!host) return;
    var ul = el("ul", { class: "gnb", id: "gnb" }, NAV.map(function (n) {
      return el("li", null, el("a", {
        href: n.href, "aria-current": n.page === page ? "page" : null
      }, n.label));
    }));
    var toggle = el("button", {
      class: "nav-toggle", type: "button", "aria-controls": "gnb", "aria-expanded": "false"
    }, [el("span", { class: "sr-only" }, "메뉴 열기"), el("span", { class: "bar", "aria-hidden": "true" })]);
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      toggle.firstChild.textContent = open ? "메뉴 열기" : "메뉴 닫기";
      ul.classList.toggle("open", !open);
    });
    host.className = "site-header";
    append(host, el("div", { class: "container header-inner" }, [
      el("a", { class: "logo", href: "index.html" }, S.company.name),
      el("nav", { "aria-label": "주 메뉴" }, [toggle, ul])
    ]));
  }

  function renderFooter(S) {
    var host = document.getElementById("site-footer");
    if (!host) return;
    var c = S.company;
    host.className = "site-footer";
    append(host, el("div", { class: "container" }, [
      el("p", { class: "footer-name" }, c.name),
      list([
        row("대표자", c.ceo),
        row("사업자등록번호", c.bizNo),
        row("주소", c.address),
        row("전화", c.tel, isEmpty(c.tel) ? null : telHref(c.tel)),
        row("팩스", c.fax),
        row("이메일", c.email, isEmpty(c.email) ? null : "mailto:" + c.email)
      ], "footer-info"),
      el("p", { class: "footer-links" }, el("a", { href: "privacy.html" }, "개인정보처리방침")),
      el("p", { class: "copyright" }, "© " + new Date().getFullYear() + " " + (isEmpty(c.nameEn) ? c.name : c.nameEn))
    ]));
  }

  // ---------- 페이지별 ----------
  function cards(items, linkHref) {
    return el("div", { class: "cards" }, items.map(function (it) {
      return el("article", { class: "card" }, [
        el("h3", null, it.title),
        isEmpty(it.summary) ? null : el("p", null, it.summary),
        linkHref ? el("a", { class: "more", href: linkHref }, "자세히 보기") : null
      ]);
    }));
  }
  function validItems(arr) {
    return isEmpty(arr) ? [] : arr.filter(function (it) { return it && !isEmpty(it.title); });
  }

  var PAGES = {
    home: function (S) {
      var h = S.hero || {};
      var c = S.company;
      var biz = validItems(S.business);
      var prod = validItems(S.products);
      var contactRows = list([
        row("전화", c.tel, isEmpty(c.tel) ? null : telHref(c.tel)),
        row("이메일", c.email, isEmpty(c.email) ? null : "mailto:" + c.email)
      ], "info-list");
      return [
        el("section", { class: "hero" }, el("div", { class: "container" }, [
          el("h1", null, isEmpty(h.slogan) ? c.name : h.slogan),
          isEmpty(h.summary) ? null : el("p", { class: "hero-summary" }, h.summary),
          el("div", { class: "hero-cta" }, [
            el("a", { class: "btn btn-primary", href: "contact.html" }, "문의하기"),
            prod.length ? el("a", { class: "btn", href: "products.html" }, "제품 보기") : null
          ])
        ])),
        biz.length ? section("사업분야", cards(biz, "business.html")) : null,
        prod.length ? section("제품·솔루션", cards(prod, "products.html"), "alt") : null,
        contactRows ? section("문의", contactRows) : null
      ];
    },

    about: function (S) {
      var a = S.about || {};
      var values = validItems(a.values);
      var hist = isEmpty(a.history) ? [] : a.history.filter(function (h) { return h && !isEmpty(h.date) && !isEmpty(h.text); });
      var c = S.company;
      var parts = [
        pageHead("회사소개"),
        section("인사말", isEmpty(a.greeting) ? null : el("div", { class: "prose" }, [
          paragraphs(a.greeting),
          isEmpty(c.ceo) ? null : el("p", { class: "sign" }, c.name + " 대표이사 " + c.ceo)
        ])),
        section("비전", isEmpty(a.vision) ? null : el("p", { class: "lead" }, a.vision), "alt"),
        section("핵심가치", values.length ? cards(values.map(function (v) {
          return { title: v.title, summary: v.desc };
        })) : null),
        section("연혁", hist.length ? el("ol", { class: "timeline" }, hist.map(function (h) {
          return el("li", null, [el("span", { class: "date" }, h.date), el("span", null, h.text)]);
        })) : null, "alt"),
        section("오시는 길", list([row("주소", c.address), row("전화", c.tel, isEmpty(c.tel) ? null : telHref(c.tel))], "info-list"))
      ];
      // 회사소개 본문이 주소 외에 하나도 없을 때도 페이지는 성립 (오시는 길)
      return parts;
    },

    business: function (S) {
      var items = validItems(S.business);
      return [
        pageHead("사업분야"),
        el("section", { class: "section" }, el("div", { class: "container" },
          items.length ? items.map(function (it) {
            return el("article", { class: "detail" }, [
              el("h2", null, it.title),
              isEmpty(it.summary) ? null : el("p", { class: "lead" }, it.summary),
              paragraphs(it.detail)
            ]);
          }) : emptyNote()))
      ];
    },

    products: function (S) {
      var items = validItems(S.products);
      return [
        pageHead("제품·솔루션"),
        el("section", { class: "section" }, el("div", { class: "container" },
          items.length ? items.map(function (it) {
            var feats = isEmpty(it.features) ? [] : it.features.filter(function (f) { return !isEmpty(f); });
            return el("article", { class: "detail" }, [
              el("h2", null, it.title),
              isEmpty(it.summary) ? null : el("p", { class: "lead" }, it.summary),
              isEmpty(it.image) ? null : el("img", { src: it.image, alt: isEmpty(it.imageAlt) ? it.title : it.imageAlt, loading: "lazy" }),
              feats.length ? el("ul", { class: "features" }, feats.map(function (f) { return el("li", null, f); })) : null
            ]);
          }) : emptyNote()))
      ];
    },

    references: function (S) {
      var items = isEmpty(S.references) ? [] : S.references.filter(function (r) { return r && !isEmpty(r.title); });
      items.sort(function (x, y) { return (Number(y.year) || 0) - (Number(x.year) || 0); });
      var body;
      if (!items.length) {
        body = emptyNote();
      } else {
        body = el("div", { class: "table-wrap" }, el("table", null, [
          el("caption", { class: "sr-only" }, "수행 실적 목록"),
          el("thead", null, el("tr", null, ["연도", "발주처", "사업명", "비고"].map(function (t) {
            return el("th", { scope: "col" }, t);
          }))),
          el("tbody", null, items.map(function (r) {
            return el("tr", null, [r.year, r.client, r.title, r.note].map(function (v) {
              return el("td", null, isEmpty(v) ? "" : String(v));
            }));
          }))
        ]));
      }
      return [pageHead("실적"), el("section", { class: "section" }, el("div", { class: "container" }, body))];
    },

    contact: function (S) {
      var c = S.company;
      var info = list([
        row("전화", c.tel, isEmpty(c.tel) ? null : telHref(c.tel)),
        row("팩스", c.fax),
        row("이메일", c.email, isEmpty(c.email) ? null : "mailto:" + c.email),
        row("주소", c.address)
      ], "info-list");
      // 문의 폼은 수신 방식(계획서 D1) 확정 전까지 넣지 않는다.
      return [pageHead("문의하기"), el("section", { class: "section" }, el("div", { class: "container" }, info || emptyNote()))];
    },

    privacy: function (S) {
      var p = S.privacy || {};
      var body = paragraphs(p.body);
      return [
        pageHead("개인정보처리방침"),
        el("section", { class: "section" }, el("div", { class: "container prose" }, body ? [
          isEmpty(p.effectiveDate) ? null : el("p", { class: "meta" }, "시행일: " + p.effectiveDate),
          body
        ] : emptyNote()))
      ];
    }
  };

  // ---------- 실행 ----------
  function main() {
    var S = window.SITE;
    var mainEl = document.getElementById("main");
    if (!S || !S.company || isEmpty(S.company.name)) {
      // 콘텐츠 파일 누락은 조용히 넘기지 않는다
      if (mainEl) append(mainEl, el("p", { class: "empty" }, "콘텐츠 파일(content/site.js)을 불러오지 못했습니다."));
      throw new Error("window.SITE 누락 또는 company.name 없음");
    }
    var page = mainEl ? mainEl.getAttribute("data-page") : null;
    var fn = PAGES[page];
    if (!fn) throw new Error("알 수 없는 data-page: " + page);
    renderHeader(S, page);
    append(mainEl, fn(S));
    renderFooter(S);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
