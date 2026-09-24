# 🌊 김남섭 포트폴리오 웹사이트 (코디세이 2기 마리너)

순수 HTML5, CSS3, Vanilla JavaScript만으로 제작된 모바일 퍼스트 반응형 포트폴리오 웹사이트입니다.  
외부 프레임워크(React 등) 없이 웹 브라우저의 기본 원리인 **"사용자 이벤트 → 상태 변경 → DOM 업데이트"** 흐름을 직접 체득하고, GitHub REST API를 연동하여 동적으로 저장소 목록을 렌더링하도록 구현되었습니다.

---

## 🔗 배포 및 저장소 링크

- **배포 URL (GitHub Pages)**: [https://rye6837-web.github.io/Codyssey_B1-1/](https://rye6837-web.github.io/Codyssey_B1-1/)
- **GitHub 저장소 URL**: [https://github.com/rye6837-web/Codyssey_B1-1](https://github.com/rye6837-web/Codyssey_B1-1)

---

## 📸 실행 화면 미리보기 (Screenshots)

| 데스크톱 라이트 모드 | 데스크톱 다크 모드 | 모바일 뷰 (375px) |
| :---: | :---: | :---: |
| ![데스크톱 라이트](images/screenshots/desktop_light.png) | ![데스크톱 다크](images/screenshots/desktop_dark.png) | ![모바일 뷰](images/screenshots/mobile.png) |

---

## 🛠️ 사용 기술 및 개발 환경

- **마크업**: 순수 HTML5 (시맨틱 태그: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **스타일링**: 순수 CSS3 (모바일 퍼스트, CSS 변수 테마 시스템, Flexbox, Grid)
- **스크립트**: Vanilla JavaScript (ES6+, `const`/`let`, 화살표 함수, `async`/`await`, `fetch`)
- **외부 리소스 (허용 항목)**: Google Fonts (Inter, Noto Sans KR), Font Awesome 아이콘

---

## 📌 주요 기능 및 구현 기준값 (Specification)

### 1. 반응형 레이아웃 (모바일 퍼스트)
- **모바일**: 기본 폭 (~767px), 세로 스택 레이아웃 및 햄버거 메뉴 지원
- **태블릿 브레이크포인트**: `768px` 이상 (2열 그리드 및 확장 레이아웃)
- **데스크톱 브레이크포인트**: `1024px` 이상 (3열 그리드 및 가로 네비게이션 바)

### 2. 인터랙션 및 기준 수치
- **네비게이션 배경 전환**: 스크롤 **`60px`** 이상 시 블러/음영 스타일(`.scrolled`) 적용
- **스크롤 탑 버튼**: 스크롤 **`300px`** 이상 시 우측 하단에 부드럽게 노출(`.show`), 클릭 시 상단 스무스 이동
- **스크롤 등장 애니메이션**: `IntersectionObserver` 사용, 임계값(**`threshold: 0.2`**) 적용
- **타자기 효과 (보너스)**: Hero 섹션 메인 타이틀 한 글자씩 타이핑 출력
- **다크 모드**:
  - `[data-theme="dark"]` CSS 변수 전환
  - `localStorage`를 통한 새로고침 후 테마 상태 유지
  - `prefers-color-scheme` 미디어 쿼리를 통한 시스템 테마 감지 (보너스)

### 3. GitHub API 비동기 연동
- **엔드포인트**: `https://api.github.com/users/rye6837-web/repos`
- **4가지 상태 UI 완벽 처리**:
  1. **로딩 중**: 스피너 및 안내 문구 렌더링
  2. **성공**: `array.map()` 기반 프로젝트 카드 그리드 렌더링
  3. **실패(에러)**: 403 레이트 리밋 또는 네트워크 에러 안내 및 **[다시 시도]** 버튼 지원
  4. **빈 데이터**: 필터링 결과 또는 저장소가 없을 때 안내 메시지
- **언어별 필터링 (보너스)**: `array.filter()`를 활용한 프로젝트 언어별 실시간 필터링

### 4. 폼 유효성 검사 (Contact Form)
- 이름, 이메일, 메시지 필수 입력 검증 (미입력 시 인라인 에러 노출)
- 이메일 정규식 포맷 검증
- `event.preventDefault()`를 통한 기본 새로고침 방지 및 성공 피드백 알림

### 5. 순수 CSS3 & Vanilla JS 3D 인터랙션 (Pure 3D Feature)
- **외부 3D 라이브러리(Three.js 등) 사용 0%**: 오직 브라우저 순수 CSS3 3D Transform(`perspective`, `rotateX/Y`)과 바닐라 JS만으로 구현하여 과제 제약 조건 100% 준수
- **Hero 3D 뎁스 패럴랙스 (Parallax)**: 마우스 커서 위치에 따라 배경 입체 격자망(Grid), 네온 글로우, 타이틀이 서로 다른 층위로 기울어져 깊이감 있는 공간감 연출
- **3D 인터랙티브 테크 큐브 (Cube Showcase)**:
  - `Isaac Sim`을 포함한 6개 핵심 기술 스택이 3D 정육면체로 360도 자동 회전
  - 마우스 드래그 조작으로 원하는 각도로 큐브를 직접 회전 가능
  - 조작을 멈추면 **1.5초 후 자동으로 부드럽게 기본 회전으로 복귀**하는 지능형 타이머 내장
  - **라이트/다크 듀얼 테마 최적화**: 라이트 모드는 영롱한 화이트 글래스모피즘(유리 질감), 다크 모드는 사이버 네온 다크 스타일로 자동 전환
- **프로젝트 & 스킬 카드 마우스 3D 틸트 (Tilt)**:
  - 깃허브 API 동적 카드 및 스킬 카드에 마우스를 올리면 마우스 방향으로 카드가 들려 올려지며 은은한 반사광(글레어) 추적
  - 모바일 환경(스마트폰/태블릿)에서는 터치 스크롤 편의를 위해 자동으로 평면 카드로 전환

---

## 📂 프로젝트 구조

```text
Codyssey_B1-1/
├── index.html           # 메인 시맨틱 HTML 문서
├── css/
│   └── style.css        # CSS 변수 및 반응형 스타일시트
├── js/
│   └── main.js          # 인터랙션 및 비동기 API 로직
├── images/
│   └── profile.svg      # 안경을 쓴 단정한 미니멀 아바타 벡터 이미지
├── README.md            # 프로젝트 소개 및 설명서
└── EXECUTION_PLAN.md    # 미션 실행 계획서
```

---

## 🚀 로컬 실행 및 검증 방법

1. 프로젝트 디렉토리에서 간단한 로컬 웹 서버를 실행합니다:
   ```bash
   python3 -m http.server 8000
   ```
2. 브라우저에서 아래 주소로 접속합니다:
   ```text
   http://localhost:8000
   ```
3. F12 개발자 도구(Device Toolbar)를 켜서 모바일(375px), 태블릿(768px), 데스크톱(1200px) 환경을 검증합니다.
