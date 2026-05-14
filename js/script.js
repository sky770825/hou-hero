/**
 * 侯鐘堡運動醫學品牌 - 互動腳本
 */

// ========================================
// Cart State Management (Global)
// ========================================
const CART_KEY = 'hou_cart';

// Load cart from localStorage
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Get total item count
function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// Get total price
function getCartTotal() {
    return getCart().reduce((sum, item) => {
        const price = parseInt(item.currentPrice.replace(/NT\$|,/g, ''));
        return sum + (price * item.quantity);
    }, 0);
}

// Add item to cart
function addToCart(productKey, quantity = 1) {
    const product = productData[productKey];
    if (!product) return false;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.key === productKey);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            key: productKey,
            icon: product.icon,
            title: product.title,
            currentPrice: product.currentPrice,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartUI();
    return true;
}

// Remove item from cart
function removeFromCart(productKey) {
    let cart = getCart();
    cart = cart.filter(item => item.key !== productKey);
    saveCart(cart);
    updateCartUI();
}

// Update item quantity
function updateQuantity(productKey, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productKey);
        return;
    }
    
    let cart = getCart();
    const item = cart.find(item => item.key === productKey);
    if (item) {
        item.quantity = Math.min(newQuantity, 10);
        saveCart(cart);
        updateCartUI();
    }
}

// Update cart badge and dropdown
function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartBadge) return;

    const cart = getCart();
    const count = getCartCount();
    const total = getCartTotal();

    // Update badge
    cartBadge.textContent = count;
    if (count > 0) {
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }

    // Update cart dropdown
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">購物車是空的</p>';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        let itemsHtml = '';
        cart.forEach(item => {
            itemsHtml += `
                <div class="cart-item" data-key="${item.key}">
                    <div class="cart-item-icon">${item.icon}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.currentPrice} × ${item.quantity}</div>
                        <div class="cart-item-controls">
                            <button class="cart-qty-btn qty-minus" data-key="${item.key}">−</button>
                            <span class="cart-qty">${item.quantity}</span>
                            <button class="cart-qty-btn qty-plus" data-key="${item.key}">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-key="${item.key}">&times;</button>
                </div>
            `;
        });
        cartItems.innerHTML = itemsHtml;
        if (cartFooter) cartFooter.style.display = 'block';
        if (cartTotal) cartTotal.textContent = 'NT$' + total.toLocaleString();

        // Attach event listeners for quantity buttons
        document.querySelectorAll('.cart-qty-btn.qty-minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.getAttribute('data-key');
                const item = getCart().find(i => i.key === key);
                if (item) updateQuantity(key, item.quantity - 1);
            });
        });

        document.querySelectorAll('.cart-qty-btn.qty-plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.getAttribute('data-key');
                const item = getCart().find(i => i.key === key);
                if (item) updateQuantity(key, item.quantity + 1);
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.getAttribute('data-key');
                removeFromCart(key);
            });
        });
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Toggle cart dropdown
function toggleCart(show) {
    const dropdown = document.getElementById('cartDropdown');
    if (!dropdown) return;

    if (show === undefined) {
        dropdown.classList.toggle('active');
    } else if (show) {
        dropdown.classList.add('active');
    } else {
        dropdown.classList.remove('active');
    }
}

// ========================================
// Product Data (Global - needed by cart functions)
// ========================================
const productData = {
    'honey-lemon-gel': {
        icon: '🍯',
        badge: '運動增補品',
        title: 'BLACT蜂蜜檸檬果膠',
        description: '採用天然蜂蜜與檸檬精製而成的能量果膠，適合賽前能量儲備與長時間運動補給。入口清新酸甜，快速補充碳水化合物，讓您在訓練與比賽中保持最佳狀態。',
        originalPrice: 'NT$1,200',
        currentPrice: 'NT$950',
        discount: '79折',
        paymentLink: 'https://www.blact.co'
    },
    'beetroot-capsule': {
        icon: '🫐',
        badge: '運動增補品',
        title: 'SPEED ENERGY 全速甜菜根膠囊',
        description: '富含天然硝酸鹽的甜菜根膠囊，有助於提升血液循環與氧氣運輸效率。增強運動耐力與爆發力，是馬拉松與自行車選手的熱門選擇。',
        originalPrice: 'NT$1,699',
        currentPrice: 'NT$1,399',
        discount: '82折',
        paymentLink: 'https://www.blact.co'
    },
    'q10-capsule': {
        icon: '⚡',
        badge: '運動增補品',
        title: 'Power Q10爬升膠囊',
        description: '高濃度輔酶Q10配方，支持細胞能量產生與心肌功能。在高強度訓練與爬坡項目中提供持久能量輸出，延緩疲勞發生。',
        originalPrice: 'NT$1,799',
        currentPrice: 'NT$1,499',
        discount: '83折',
        paymentLink: 'https://www.blact.co'
    },
    'electrolyte-capsule': {
        icon: '💧',
        badge: '運動增補品',
        title: 'Power Salt強力電解膠囊',
        description: '完整電解質配方，包含鈉、鉀、鎂、鈣等關鍵礦物質。有效預防運動中抽筋與電解質失衡，適合長時間耐力運動補給。',
        originalPrice: 'NT$799',
        currentPrice: 'NT$790',
        discount: '99折',
        paymentLink: 'https://www.blact.co'
    },
    'exosome-set': {
        icon: '✨',
        badge: '保養品',
        title: '萃泌外泌體全效套裝組',
        description: '革命性細胞修護科技，含有多種活性生長因子與修護肽。深層滋養肌膚，促進組織修復與再生，是運動後 recovery 的極佳輔助品。',
        originalPrice: 'NT$4,447',
        currentPrice: 'NT$3,288',
        discount: '74折',
        paymentLink: 'https://www.blact.co'
    },
    'maca-powder': {
        icon: '🌿',
        badge: '保健品',
        title: '祕魯黑瑪卡粉',
        description: '來自安地斯高原的優質黑瑪卡，含有豐富的胺基酸、維生素與礦物質。提升體力與耐力，調節生理機能，是運動員的天然能量補充來源。',
        originalPrice: 'NT$1,200',
        currentPrice: 'NT$990',
        discount: '83折',
        paymentLink: 'https://www.blact.co'
    }
};

// Current product key being viewed in modal
let currentProductKey = null;

// ========================================
// DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Initialize Cart UI on page load
    // ========================================
    updateCartUI();

    // ========================================
    // Cart Icon Click - Toggle Dropdown
    // ========================================
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }

    // Cart Close Button
    const cartClose = document.getElementById('cartClose');
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            toggleCart(false);
        });
    }

    // Close cart when clicking overlay (click outside to close)
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('cartDropdown');
        const icon = document.getElementById('cartIcon');
        if (dropdown && dropdown.classList.contains('active')) {
            if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
                toggleCart(false);
            }
        }
    });

    // ========================================
    // Navigation Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;
    
    function handleNavbarScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
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
    // Mobile Menu Toggle
    // ========================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // ========================================
    // Scroll Animations (Intersection Observer)
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
    
    fadeInElements.forEach(function(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeInObserver.observe(element);
    });
    
    // ========================================
    // Smooth Scroll for Anchor Links
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
    // Hero Section Load Animation
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
    // Number Animation (About Section)
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
    // Page Load Complete
    // ========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ========================================
    // Product Modal
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
    const btnAddToCart = document.querySelector('.btn-add-to-cart');

    // 開啟 Modal
    function openModal(productKey) {
        const product = productData[productKey];
        if (!product) return;

        currentProductKey = productKey;
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
        currentProductKey = null;
    }

    // 卡片點擊事件
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

    // 加入購物車按鈕
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', function() {
            if (currentProductKey) {
                const quantity = parseInt(qtyInput.value) || 1;
                addToCart(currentProductKey, quantity);
                showToast('已加入購物車');
                closeModal();
            }
        });
    }

});
