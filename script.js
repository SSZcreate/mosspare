// メニューのトグル機能
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');

// PC版スケーリング機能
function applyPCScaling() {
  const pcElement = document.querySelector('.SP.PC');
  if (!pcElement) return;
  
  const windowWidth = window.innerWidth;
  
  if (windowWidth >= 768 && windowWidth < 1920) {
    const scale = windowWidth / 1920;
    pcElement.style.transform = `scale(${scale})`;
    pcElement.style.transformOrigin = 'top left';
    // 高さを補正して下の余白をなくす
    const originalHeight = 8411;
    const scaledHeight = originalHeight * scale;
    pcElement.style.marginBottom = `${scaledHeight - originalHeight}px`;
  } else if (windowWidth >= 1920) {
    pcElement.style.transform = 'none';
    pcElement.style.marginBottom = '0';
  }
}

// 初回実行とリサイズ時に適用
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyPCScaling);
} else {
  applyPCScaling();
}
window.addEventListener('resize', applyPCScaling);

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.add('active');
    }
  });
}

if (menuClose) {
  menuClose.addEventListener('click', () => {
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
    }
  });
}

// スムーススクロール機能
document.querySelectorAll('a.nav-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const isPC = window.innerWidth >= 768;
      
      // モバイルメニューを先に閉じる
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        // メニューが閉じるのを待ってからスクロール
        setTimeout(() => {
          scrollToTarget(targetElement, isPC);
        }, 350);
      } else {
        scrollToTarget(targetElement, isPC);
      }
    }
  });
});

// スクロール処理を関数化
function scrollToTarget(targetElement, isPC) {
  if (isPC) {
    // PC版の場合、ナビゲーションバーの高さを考慮
    const navbarHeight = 90;
    const pcElement = document.querySelector('.SP.PC');
    const scale = window.innerWidth >= 1920 ? 1 : window.innerWidth / 1920;
    
    // 要素の実際の位置を取得
    const elementRect = targetElement.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + elementRect.top;
    
    // スケーリングを考慮したスクロール位置
    const scrollTo = absoluteTop - (navbarHeight * scale);
    
    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
  } else {
    // スマホ版の場合、scrollIntoViewを使用
    const originalScrollMargin = targetElement.style.scrollMarginTop;
    targetElement.style.scrollMarginTop = '20px';
    
    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // スクロールマージンを元に戻す
    setTimeout(() => {
      targetElement.style.scrollMarginTop = originalScrollMargin;
    }, 1000);
  }
}

// メニュー外をクリックしたら閉じる
if (mobileMenu) {
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu || e.target.classList.contains('menu-background')) {
      mobileMenu.classList.remove('active');
    }
  });
  
  // メニューが開いているとき、背景をクリックしても閉じる
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('active')) {
      const isClickInsideMenu = mobileMenu.contains(e.target);
      const isMenuToggle = menuToggle && menuToggle.contains(e.target);
      
      if (!isClickInsideMenu && !isMenuToggle) {
        mobileMenu.classList.remove('active');
      }
    }
  });
}

// ===== スクロールアニメーション =====
function initScrollAnimations() {
  // アニメーション対象要素を設定
  const animationTargets = [
    // スマホ版
    { selector: '.SP.div .text-wrapper', class: 'fade-in-up' },
    { selector: '.SP.div .text-wrapper-3', class: 'fade-in-up' },
    { selector: '.SP.div .text-wrapper-4', class: 'fade-in-up' },
    { selector: '.SP.div .text-wrapper-5', class: 'fade-in-up' },
    { selector: '.SP.div .text-wrapper-6', class: 'fade-in-up' },
    { selector: '.SP.div .frame-2', class: 'fade-in-up' },
    { selector: '.SP.div .frame-4', class: 'fade-in-up' },
    { selector: '.SP.div .group-10', class: 'scale-in' },
    { selector: '.SP.div .image-3', class: 'fade-in-left' },
    { selector: '.SP.div .image-4', class: 'fade-in-right' },
    { selector: '.SP.div .image-5', class: 'fade-in-left' },
    { selector: '.SP.div .image-6', class: 'fade-in-right' },
    // PC版
    { selector: '.SP.PC .text-wrapper-20', class: 'fade-in-up' },
    { selector: '.SP.PC .text-wrapper-21', class: 'fade-in-up' },
    { selector: '.SP.PC .text-wrapper-22', class: 'fade-in-up' },
    { selector: '.SP.PC .text-wrapper-23', class: 'fade-in-up' },
    { selector: '.SP.PC .frame-5', class: 'fade-in-up' },
    { selector: '.SP.PC .frame-6', class: 'fade-in-up' },
    { selector: '.SP.PC .frame-7', class: 'scale-in' },
    { selector: '.SP.PC .image-8', class: 'fade-in-left' },
    { selector: '.SP.PC .image-9', class: 'fade-in-right' },
    { selector: '.SP.PC .image-10', class: 'fade-in-left' },
    { selector: '.SP.PC .image-11', class: 'fade-in-right' },
    { selector: '.SP.PC .image-12', class: 'fade-in-up' },
  ];

  // 各要素にアニメーションクラスを追加
  animationTargets.forEach(target => {
    const elements = document.querySelectorAll(target.selector);
    elements.forEach(el => {
      el.classList.add('animate-on-scroll', target.class);
    });
  });

  // Intersection Observerでスクロール検知
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // 一度表示したら監視を解除（パフォーマンス向上）
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // 全てのアニメーション対象を監視
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// ページ読み込み完了後にアニメーション初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}

// ===== パララックス効果（軽量版） =====
function initParallax() {
  const parallaxElements = document.querySelectorAll('.SP .grassdsss, .SP.PC .grassdsss-2');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        parallaxElements.forEach(el => {
          const speed = 0.3;
          const yPos = scrollY * speed;
          el.style.transform = `translateY(${yPos}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// パララックス初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallax);
} else {
  initParallax();
}
