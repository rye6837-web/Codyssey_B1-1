/**
 * ============================================================================
 * 김남섭 포트폴리오 메인 자바스크립트 (Pure Vanilla JavaScript)
 * - 과제 제약 사항 준수: var 금지 (const, let 사용), addEventListener 기반 이벤트
 * - 이벤트 -> 상태 변경 -> 렌더링(DOM 업데이트) 아키텍처
 * ============================================================================
 */

// 엄격 모드 활성화 (잠재적 오류 방지)
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. 전역 상태 (Application State)
  // --------------------------------------------------------------------------
  const state = {
    // 테마 상태: 'light' | 'dark'
    theme: 'light',
    // 깃허브 저장소 목록 데이터
    repositories: [],
    // 현재 선택된 언어 필터: 'all' 또는 특정 언어명
    selectedLanguage: 'all',
    // 깃허브 API 통신 상태: 'idle' | 'loading' | 'success' | 'error' | 'empty'
    apiStatus: 'idle',
    // API 에러 발생 시 안내 메시지
    apiErrorMessage: ''
  };

  // 대상 GitHub 사용자 아이디
  const GITHUB_USERNAME = 'rye6837-web';

  // --------------------------------------------------------------------------
  // 2. 다크 모드 관리 (LocalStorage + 시스템 테마 감지)
  // --------------------------------------------------------------------------
  const initTheme = () => {
    const themeToggleBtn = document.querySelector('#themeToggleBtn');
    const themeIcon = document.querySelector('#themeIcon');

    // 1) localStorage 저장된 설정 확인
    const savedTheme = localStorage.getItem('portfolio-theme');

    // 2) 보너스 과제: 시스템 다크 모드 감지 (prefers-color-scheme)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      state.theme = savedTheme;
    } else if (prefersDark) {
      state.theme = 'dark';
    } else {
      state.theme = 'light';
    }

    // 테마 적용 렌더링 함수
    const renderTheme = () => {
      if (state.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggleBtn.setAttribute('aria-label', '라이트 모드로 전환');
      } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggleBtn.setAttribute('aria-label', '다크 모드로 전환');
      }
      // 상태를 로컬스토리지에 영구 저장 (새로고침 시 유지)
      localStorage.setItem('portfolio-theme', state.theme);
    };

    // 초기 렌더링
    renderTheme();

    // 토글 버튼 클릭 이벤트
    themeToggleBtn.addEventListener('click', () => {
      // 상태 변경
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      // DOM 업데이트
      renderTheme();
    });

    // 시스템 테마 변경 실시간 감지 (사용자가 OS 테마를 바꾸었을 때)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 사용자가 수동으로 지정한 적이 없을 때만 자동 반영
      if (!localStorage.getItem('portfolio-theme')) {
        state.theme = e.matches ? 'dark' : 'light';
        renderTheme();
      }
    });
  };

  // --------------------------------------------------------------------------
  // 3. 모바일 햄버거 메뉴 토글 & 부드러운 스크롤
  // --------------------------------------------------------------------------
  const initNavigation = () => {
    const header = document.querySelector('#header');
    const hamburgerBtn = document.querySelector('#hamburgerBtn');
    const navMenu = document.querySelector('#navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 햄버거 버튼 클릭 시 열림/닫힘 토글
    hamburgerBtn.addEventListener('click', () => {
      const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // 모바일에서 메뉴 링크 클릭 시 메뉴를 자동으로 닫기
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });

    // 스크롤 이벤트: 60px 이상 스크롤 시 헤더 배경 변경 (.scrolled)
    const handleHeaderScroll = () => {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // 초기 로드 시 한 번 실행
    handleHeaderScroll();
  };

  // --------------------------------------------------------------------------
  // 4. 스크롤 탑 버튼 (300px 이상 시 표시, 클릭 시 상단 이동)
  // --------------------------------------------------------------------------
  const initScrollTop = () => {
    const scrollTopBtn = document.querySelector('#scrollTopBtn');

    window.addEventListener('scroll', () => {
      // 요구사항: 스크롤 300px 이상에서 버튼 노출
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  };

  // --------------------------------------------------------------------------
  // 5. 스크롤 애니메이션 (Intersection Observer, 임계값 0.2 권장)
  // --------------------------------------------------------------------------
  const initScrollAnimation = () => {
    const heroSection = document.querySelector('#hero');
    // Hero는 CSS에서 즉시 표시 처리. JS에서도 in-view 추가해 일관성 유지
    if (heroSection) {
      heroSection.classList.add('in-view');
    }

    // Hero를 제외한 나머지 section-observe 타겟만 관찰
    const observerTargets = document.querySelectorAll('.section-observe:not(#hero)');

    // IntersectionObserver 지원 여부 확인
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 과제 권장 임계값 0.2 적용
      };

      const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // 한 번 나타난 섹션은 관찰 중단
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observerTargets.forEach((target) => sectionObserver.observe(target));
    } else {
      // 미지원 구형 브라우저 대비
      observerTargets.forEach((target) => target.classList.add('in-view'));
    }
  };


  // --------------------------------------------------------------------------
  // 6. 보너스 과제: Hero 섹션 타자기(타이핑) 효과
  // --------------------------------------------------------------------------
  const initTypingEffect = () => {
    const typingElement = document.querySelector('#typingText');
    const textToType = "이번에 마리너 2기로 선발되어 항해를 시작했습니다.";
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        // 자연스러운 타이핑 속도 (약 60~100ms 사이 랜덤)
        setTimeout(typeChar, 70);
      }
    };

    // 페이지 진입 후 0.4초 뒤 타이핑 시작
    setTimeout(typeChar, 400);
  };

  // --------------------------------------------------------------------------
  // 7. GitHub API 연동 및 프로젝트 카드 렌더링
  // --------------------------------------------------------------------------
  const initGitHubProjects = () => {
    const container = document.querySelector('#projectsContainer');
    const filterControls = document.querySelector('#filterControls');

    // UI 렌더링 함수: 상태(state)에 따라 알맞은 화면을 렌더링
    const renderProjects = () => {
      // 1) 로딩 상태 렌더링
      if (state.apiStatus === 'loading') {
        container.innerHTML = `
          <div class="state-box">
            <div class="spinner" aria-label="프로젝트 데이터를 불러오는 중입니다"></div>
            <p class="state-title">GitHub 저장소 불러오는 중...</p>
            <p class="state-desc">rye6837-web 님의 공개 프로젝트 목록을 가져오고 있습니다.</p>
          </div>
        `;
        return;
      }

      // 2) 에러 상태 렌더링
      if (state.apiStatus === 'error') {
        container.innerHTML = `
          <div class="state-box">
            <i class="fa-solid fa-triangle-exclamation state-error-icon" aria-hidden="true"></i>
            <p class="state-title">프로젝트를 불러올 수 없습니다</p>
            <p class="state-desc">${state.apiErrorMessage || '네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'}</p>
            <button type="button" class="btn btn-primary" id="retryFetchBtn">
              <i class="fa-solid fa-rotate-right"></i> 다시 시도
            </button>
          </div>
        `;

        // [다시 시도] 버튼에 이벤트 리스너 바인딩
        const retryBtn = document.querySelector('#retryFetchBtn');
        if (retryBtn) {
          retryBtn.addEventListener('click', fetchRepositories);
        }
        return;
      }

      // 3) 필터링 처리 (array.filter 활용)
      let displayedRepos = state.repositories;
      if (state.selectedLanguage !== 'all') {
        displayedRepos = state.repositories.filter((repo) => repo.language === state.selectedLanguage);
      }

      // 4) 빈 상태 렌더링 (필터 결과 없음 OR 저장소 자체가 없을 때)
      if (state.apiStatus === 'empty' || displayedRepos.length === 0) {
        container.innerHTML = `
          <div class="state-box">
            <i class="fa-regular fa-folder-open state-empty-icon" aria-hidden="true"></i>
            <p class="state-title">표시할 프로젝트가 없습니다</p>
            <p class="state-desc">선택하신 조건에 일치하는 저장소가 아직 등록되지 않았습니다.</p>
          </div>
        `;
        return;
      }

      // 5) 성공 상태 렌더링 (array.map과 구조분해 할당, 템플릿 리터럴 활용)
      const cardsHtml = displayedRepos.map((repo) => {
        // 구조분해 할당
        const {
          name,
          html_url,
          description,
          stargazers_count,
          language
        } = repo;

        const langDisplay = language ? language : '기타';
        const descDisplay = description ? description : '등록된 프로젝트 설명이 없습니다.';

        return `
          <article class="project-card">
            <div class="project-card-header">
              <h3 class="project-repo-name">${name}</h3>
              <a href="${html_url}" target="_blank" rel="noopener noreferrer" class="project-repo-link" aria-label="${name} 저장소 바로가기">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
            <p class="project-desc">${descDisplay}</p>
            <div class="project-meta">
              <span class="project-language">
                <span class="lang-indicator"></span>
                ${langDisplay}
              </span>
              <span class="project-stars">
                <i class="fa-regular fa-star" aria-hidden="true"></i>
                <span>${stargazers_count}</span>
              </span>
            </div>
          </article>
        `;
      }).join('');

      container.innerHTML = cardsHtml;
    };

    // 필터 버튼 렌더링 함수
    const renderFilterButtons = () => {
      // 존재하는 언어 목록 추출 (중복 제거)
      const languages = new Set();
      state.repositories.forEach((repo) => {
        if (repo.language) {
          languages.add(repo.language);
        }
      });

      let filterHtml = `<button type="button" class="filter-btn ${state.selectedLanguage === 'all' ? 'active' : ''}" data-filter="all">전체보기 (${state.repositories.length})</button>`;

      languages.forEach((lang) => {
        const count = state.repositories.filter((r) => r.language === lang).length;
        const isActive = state.selectedLanguage === lang ? 'active' : '';
        filterHtml += `<button type="button" class="filter-btn ${isActive}" data-filter="${lang}">${lang} (${count})</button>`;
      });

      filterControls.innerHTML = filterHtml;

      // 필터 버튼 클릭 이벤트 연결
      const buttons = filterControls.querySelectorAll('.filter-btn');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const filterValue = btn.getAttribute('data-filter');
          state.selectedLanguage = filterValue;
          renderFilterButtons();
          renderProjects();
        });
      });
    };

    // GitHub API 비동기 호출 (async/await + try/catch)
    const fetchRepositories = async () => {
      // 상태 변경: 로딩 중
      state.apiStatus = 'loading';
      state.apiErrorMessage = '';
      renderProjects();

      try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`);

        // 403 레이트 리밋 또는 기타 HTTP 오류 처리
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error('GitHub API 요청 한도(시간당 60회)를 초과했습니다. 잠시 후 다시 시도해주세요.');
          } else if (response.status === 404) {
            throw new Error('사용자 저장소를 찾을 수 없습니다.');
          } else {
            throw new Error(`데이터 요청 실패 (코드: ${response.status})`);
          }
        }

        const data = await response.json();

        // 성공 상태 업데이트
        state.repositories = data;
        state.apiStatus = data.length === 0 ? 'empty' : 'success';

        renderFilterButtons();
        renderProjects();
      } catch (error) {
        // 에러 상태 업데이트
        state.apiStatus = 'error';
        state.apiErrorMessage = error.message;
        renderProjects();
      }
    };

    // 초기 호출
    fetchRepositories();
  };

  // --------------------------------------------------------------------------
  // 8. Contact 폼 유효성 검사 (Form UX)
  // --------------------------------------------------------------------------
  const initContactForm = () => {
    const form = document.querySelector('#contactForm');
    const nameInput = document.querySelector('#userName');
    const emailInput = document.querySelector('#userEmail');
    const messageInput = document.querySelector('#userMessage');

    const nameError = document.querySelector('#nameError');
    const emailError = document.querySelector('#emailError');
    const messageError = document.querySelector('#messageError');
    const formFeedback = document.querySelector('#formFeedback');

    // 이메일 정규표현식 검증
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // 개별 필드 유효성 검사 및 에러 표시 함수
    const validateName = () => {
      const val = nameInput.value.trim();
      if (!val) {
        nameError.textContent = '이름을 입력해주세요.';
        nameInput.classList.add('invalid');
        return false;
      }
      nameError.textContent = '';
      nameInput.classList.remove('invalid');
      return true;
    };

    const validateEmail = () => {
      const val = emailInput.value.trim();
      if (!val) {
        emailError.textContent = '이메일을 입력해주세요.';
        emailInput.classList.add('invalid');
        return false;
      }
      if (!isValidEmail(val)) {
        emailError.textContent = '올바른 이메일 형식을 입력해주세요 (예: name@domain.com)';
        emailInput.classList.add('invalid');
        return false;
      }
      emailError.textContent = '';
      emailInput.classList.remove('invalid');
      return true;
    };

    const validateMessage = () => {
      const val = messageInput.value.trim();
      if (!val) {
        messageError.textContent = '메시지 내용을 입력해주세요.';
        messageInput.classList.add('invalid');
        return false;
      }
      if (val.length < 5) {
        messageError.textContent = '메시지를 5자 이상 작성해주세요.';
        messageInput.classList.add('invalid');
        return false;
      }
      messageError.textContent = '';
      messageInput.classList.remove('invalid');
      return true;
    };

    // input 이벤트로 실시간 피드백
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    // submit 이벤트 처리
    form.addEventListener('submit', (e) => {
      // 기본 폼 제출 동작(새로고침) 방지
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = '입력 항목에 오류가 있습니다. 수정 후 다시 시도해주세요.';
        formFeedback.setAttribute('aria-hidden', 'false');
        return;
      }

      // 제출 성공 처리
      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <strong>메시지가 전송되었습니다!</strong> 소중한 연락 감사합니다. 곧 확인하고 답변 드리겠습니다.
      `;
      formFeedback.setAttribute('aria-hidden', 'false');

      // 폼 초기화
      form.reset();

      // 5초 후 피드백 자동 숨김 (style.display 제거 후 className 초기화로 통일)
      setTimeout(() => {
        formFeedback.className = 'form-feedback';
        formFeedback.innerHTML = '';
        formFeedback.setAttribute('aria-hidden', 'true');
      }, 5000);
    });
  };

  // --------------------------------------------------------------------------
  // 앱 전체 초기화 실행
  // --------------------------------------------------------------------------
  initTheme();
  initNavigation();
  initScrollTop();
  initScrollAnimation();
  initTypingEffect();
  initGitHubProjects();
  initContactForm();
});
