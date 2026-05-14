/**
 * 侯鐘堡運動醫學品牌 - 互動腳本
 */

// 等待 DOM 載入完成
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 導航列滾動效果
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        // 當滾動超過 50px 時添加 scrolled 類別
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // 監聽滾動事件（使用節流優化效能）
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ========================================
    // 移動裝置選單切換
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 切換選單顯示
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // 點擊選單連結後關閉選單
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ========================================
    // 滾動動畫（Intersection Observer）
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const fadeInElements = document.querySelectorAll('.section-header, .about-content, .service-card, .brand-main, .contact-info, .location-card');
    
    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 初始化動畫元素樣式
    fadeInElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(element);
    });
    
    // ========================================
    // 錨點滾動平滑效果
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // Hero 區域載入動畫
    // ========================================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        window.addEventListener('load', function() {
            setTimeout(function() {
                heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // ========================================
    // 數字動畫效果（About 區）
    // ========================================
    const highlightNumbers = document.querySelectorAll('.highlight-number');
    
    const numberObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[\d]/g, '');
                
                animateNumber(target, 0, numericValue, 2000, suffix);
                numberObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    highlightNumbers.forEach(function(number) {
        numberObserver.observe(number);
    });
    
    function animateNumber(element, start, end, duration, suffix) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用 easeOutExpo 緩動函數
            const easeOutExpo = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutExpo * (end - start) + start);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // ========================================
    // 頁面載入完成
    // ========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
});
