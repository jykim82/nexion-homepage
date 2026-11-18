# (주)넥시온 홈페이지

정적 사이트(HTML/CSS/JS). 빌드 과정 없음. 계획은 [PLAN.md](PLAN.md) 참고.

## 미리보기
- `index.html`을 브라우저로 열면 됩니다 (더블클릭 가능).

## 내용 수정 방법
- **`content/site.js` 파일만 수정합니다.** 다른 파일은 고치지 않아도 전 페이지에 반영됩니다.
- 값을 모르면 `null`로 둡니다. `null`인 항목은 화면에 나오지 않습니다.
- 목록 항목(사업분야·제품·실적 등)은 `title`이 비어 있으면 화면에 나오지 않습니다.
- 이미지는 `assets/img/`에 넣고 `site.js`에 경로를 적습니다.

## 디자인 색상 / 로고
- 색상: `assets/css/style.css` 맨 위 `:root`의 `--color-*` 값 (명함 기준).
- 로고: `assets/img/logo.svg`(밝은 배경), `logo-white.svg`(어두운 배경), `symbol.svg`(파비콘).
  원본 로고 파일을 받으면 같은 파일명으로 덮어쓰면 됩니다.

## 점검
```
npm ci
npx playwright install chromium   # 최초 1회
npm test
```
7개 페이지 × 모바일/데스크톱 × (실데이터, 테스트 데이터)에서
콘솔 에러, "null"/"undefined" 노출, 가로 스크롤, 이미지 alt, 모바일 메뉴 동작을 확인합니다.
`tests/fixture-site.js`는 테스트용 가짜 데이터이며 운영에 쓰지 않습니다.

## 배포
- `main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/pages.yml`)가
  자동 점검 → 통과 시 GitHub Pages(https://nexioninc.co.kr)에 배포합니다. 점검 실패 시 배포되지 않습니다.
- 배포 제외: `tests/`, `PLAN.md`, `README.md`, `package*.json`, `.github/`
- 최초 1회 설정(GitHub·가비아 DNS)은 PLAN.md 6.5 참조.
