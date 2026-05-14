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

    // ========================================
    // Product Modal 功能
    // ========================================
    const productModal = document.getElementById('productModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const shopCards = document.querySelectorAll('.shop-card[data-product]');
    const modalIcon = document.querySelector('.modal-icon');
    const modalBadge = document.querySelector('.modal-badge');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalPriceOriginal = document.querySelector('.modal-price-original');
    const modalPriceCurrent = document.querySelector('.modal-price-current');
    const modalPriceDiscount = document.querySelector('.modal-price-discount');
    const btnBuy = document.querySelector('.btn-buy');
    const qtyInput = document.querySelector('.qty-input');
    const qtyMinus = document.querySelector('.qty-minus');
    const qtyPlus = document.querySelector('.qty-plus');

    // 商品資料
    const productData = {
        'honey-lemon-gel': {
            icon: '🍯',
            badge: '運動增補品',
            title: 'BLACT蜂蜜檸檬果膠',
            description: '採用天然蜂蜜與檸檬精製而成的能量果膠，適合賽前能量儲備與長時間運動補給。入口清新酸甜，快速補充碳水化合物，讓您在訓練與比賽中保持最佳狀態。',
            originalPrice: 'NT$1,200',
            currentPrice: 'NT$950',
            discount: '79折',
            paymentLink: 'https://buy.stripe.com/test_honey_lemon_gel'
        },
        'beetroot-capsule': {
            icon: '🫐',
            badge: '運動增補品',
            title: 'SPEED ENERGY 全速甜菜根膠囊',
            description: '富含天然硝酸鹽的甜菜根膠囊，有助於提升血液循環與氧氣運輸效率。增強運動耐力與爆發力，是馬拉松與自行車選手的熱門選擇。',
            originalPrice: 'NT$1,699',
            currentPrice: 'NT$1,399',
            discount: '82折',
            paymentLink: 'https://buy.stripe.com/test_beetroot_capsule'
        },
        'q10-capsule': {
            icon: '⚡',
            badge: '運動增補品',
            title: 'Power Q10爬升膠囊',
            description: '高濃度輔酶Q10配方，支持細胞能量產生與心肌功能。在高強度訓練與爬坡項目中提供持久能量輸出，延緩疲勞發生。',
            originalPrice: 'NT$1,799',
            currentPrice: 'NT$1,499',
            discount: '83折',
            paymentLink: 'https://buy.stripe.com/test_q10_capsule'
        },
        'electrolyte-capsule': {
            icon: '💧',
            badge: '運動增補品',
            title: 'Power Salt強力電解膠囊',
            description: '完整電解質配方，包含鈉、鉀、鎂、鈣等關鍵礦物質。有效預防運動中抽筋與電解質失衡，適合長時間耐力運動補給。',
            originalPrice: 'NT$799',
            currentPrice: 'NT$790',
            discount: '99折',
            paymentLink: 'https://buy.stripe.com/test_electrolyte_capsule'
        },
        'exosome-set': {
            icon: '✨',
            badge: '保養品',
            title: '萃泌外泌體全效套裝組',
            description: '革命性細胞修護科技，含有多種活性生長因子與修護肽。深層滋養肌膚，促進組織修復與再生，是運動後 recovery 的極佳輔助品。',
            originalPrice: 'NT$4,447',
            currentPrice: 'NT$3,288',
            discount: '74折',
            paymentLink: 'https://buy.stripe.com/test_exosome_set'
        },
        'maca-powder': {
            icon: '🌿',
            badge: '保健品',
            title: '祕魯黑瑪卡粉',
            description: '來自安地斯高原的優質黑瑪卡，含有豐富的胺基酸、維生素與礦物質。提升體力與耐力，調節生理機能，是運動員的天然能量補充來源。',
            originalPrice: 'NT$1,200',
            currentPrice: 'NT$990',
            discount: '83折',
            paymentLink: 'https://buy.stripe.com/test_maca_powder'
        }
    };

    // 開啟 Modal
    function openModal(productKey) {
        const product = productData[productKey];
        if (!product) return;

        modalIcon.textContent = product.icon;
        modalBadge.textContent = product.badge;
        modalTitle.textContent = product.title;
        modalDescription.textContent = product.description;
        modalPriceOriginal.textContent = product.originalPrice;
        modalPriceCurrent.textContent = product.currentPrice;
        modalPriceDiscount.textContent = product.discount;
        btnBuy.href = product.paymentLink;
        qtyInput.value = 1;

        productModal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // 關閉 Modal
    function closeModal() {
        productModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // 卡片點擊事件（點擊整張卡片或按鈕都開啟）
    shopCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const productKey = this.getAttribute('data-product');
            openModal(productKey);
        });
    });

    // 關閉按鈕
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // 點擊背景關閉
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // ESC 鍵關閉
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });

    // 數量增減
    if (qtyMinus) {
        qtyMinus.addEventListener('click', function() {
            const current = parseInt(qtyInput.value);
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        });
    }

    if (qtyPlus) {
        qtyPlus.addEventListener('click', function() {
            const current = parseInt(qtyInput.value);
            if (current < 10) {
                qtyInput.value = current + 1;
            }
        });
    }

});
