/*
 * 테스트 전용 가짜 데이터 — 화면 렌더링 점검용이며 실제 회사 정보가 아님.
 * 운영 사이트에서 절대 사용하지 않는다 (content/site.js 만 사용).
 * 일부 값은 의도적으로 null/빈값으로 두어 "빈값 미출력" 규칙을 함께 점검한다.
 */
window.SITE = {
  domain: "example.invalid",
  company: {
    name: "(테스트)회사", nameEn: "TEST CO.", ceo: "테스트대표", bizNo: "000-00-00000",
    address: "테스트 주소", tel: "000-0000-0000", fax: null, email: "test@example.invalid"
  },
  hero: { eyebrow: "TEST · EYEBROW", slogan: "테스트 슬로건", summary: null },
  about: {
    greeting: ["테스트 문단 1", "", null, "테스트 문단 2"],
    vision: null,
    values: [{ title: "가치1", desc: "설명1" }, { title: "가치2", desc: null }, { title: null, desc: "제목 없는 항목은 숨김" }],
    history: [{ date: "2000.01", text: "테스트 연혁" }, { date: null, text: "날짜 없는 항목은 숨김" }]
  },
  business: [
    { title: "분야1", summary: "요약1", detail: ["상세 문단"] },
    { title: "분야2", summary: null, detail: null }
  ],
  products: [
    { title: "제품1", summary: "요약", features: ["기능1", null, "기능2"], image: null, imageAlt: null },
    { title: "제품2", summary: null, features: [], image: null, imageAlt: null }
  ],
  references: [
    { year: 2001, client: "발주처A", title: "사업A", note: null },
    { year: 2003, client: null, title: "사업B", note: "비고" },
    { year: 2002, client: "발주처C", title: null, note: "제목 없는 항목은 숨김" }
  ],
  privacy: { effectiveDate: "2000-01-01", body: ["조항 1", "조항 2"] }
};
