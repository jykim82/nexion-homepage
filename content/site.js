/*
 * (주)넥시온 홈페이지 콘텐츠 — 단일 원본
 *
 * - 회사 정보는 이 파일에만 입력한다. HTML/JS는 이 값을 화면에 그리기만 한다.
 * - 값이 null / 빈 문자열 / 빈 배열이면 해당 줄·섹션은 화면에 출력되지 않는다.
 * - 확인되지 않은 정보는 추측으로 채우지 말고 null로 둔다.
 * - 출처 표시: [사업자등록증] = 안산세무서 2026-10-19 발급본, [사용자] = 사용자 직접 제공
 *
 * JSON이 아닌 JS 파일인 이유: index.html을 더블클릭(file://)으로 열어도
 * 동작하도록 하기 위함 (브라우저는 file:// 에서 JSON fetch를 차단함).
 */
window.SITE = {
  domain: "nexioninc.co.kr",               // [사용자] 가비아 등록

  company: {
    name: "(주)넥시온",                     // [사업자등록증]
    nameEn: null,                           // 영문 상호 — 입력 필요
    ceo: "김종윤",                          // [사업자등록증]
    bizNo: "394-86-04375",                  // [사업자등록증]
    address: "경기도 안산시 단원구 고잔2길 9, 4층 406호 비06(고잔동, 하이베라스)", // [사업자등록증]
    tel: null,                              // 대표전화 — 입력 필요
    fax: null,                              // 팩스 — 입력 필요
    email: null                             // 대표 이메일 — 입력 필요 (tax@ 는 세금계산서 전용이므로 사용 금지)
  },

  // 홈 상단 문구
  hero: {
    slogan: null,                           // 예: "한 줄 슬로건"
    summary: null                           // 예: "회사 한 줄 소개"
  },

  about: {
    greeting: null,                         // 인사말 문단 배열. 예: ["첫 문단", "둘째 문단"]
    vision: null,                           // 비전 한 문장
    values: null,                           // 핵심가치 배열. 예: [{ title: "", desc: "" }]
    history: null                           // 연혁 배열(최신순). 예: [{ date: "2026.10", text: "" }]
  },

  // 사업분야 배열. 예: [{ title: "", summary: "", detail: ["문단"] }]
  business: null,

  // 제품·솔루션 배열. 예: [{ title: "", summary: "", features: [""], image: "assets/img/파일명.png", imageAlt: "" }]
  products: null,

  // 수행 실적 배열. 예: [{ year: 2026, client: "", title: "", note: "" }]
  references: null,

  privacy: {
    effectiveDate: null,                    // 시행일. 예: "2026-12-01"
    body: null                              // 개인정보처리방침 문단 배열 (법무 검토본만 입력)
  }
};
