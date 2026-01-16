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
