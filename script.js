document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. GLOBAL BADGE SETTINGS & LOAD DATA
    // ==========================================
    let cart = JSON.parse(localStorage.getItem('decorify_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('decorify_wishlist')) || [];

    const updateBadges = () => {
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            cartBadge.innerText = cart.length;
        }
    };
    updateBadges();

    // ==========================================
    // 2. DYNAMIC ADD TO CART SYSTEM
    // ==========================================
    const allAddToCartButtons = document.querySelectorAll('.add-cart-btn');

    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            
            if (productCard) {
                const productName = productCard.querySelector('.product-name').innerText;
                const productPrice = productCard.querySelector('.product-price').innerText;
                const productImage = productCard.querySelector('.product-img-box img').src;

                const product = {
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };

                const existingItemIndex = cart.findIndex(item => item.name === product.name);

                if (existingItemIndex > -1) {
                    cart[existingItemIndex].quantity += 1;
                } else {
                    cart.push(product);
                }

                localStorage.setItem('decorify_cart', JSON.stringify(cart));
                updateBadges();

                alert(`"${productName}" successfully added to your cart!`);
            }
        });
    });

    // ==========================================
    // 3. DYNAMIC WISHLIST (LIKE) SYSTEM
    // ==========================================
    const heartButtons = document.querySelectorAll('.wishlist-btn i');
    
    heartButtons.forEach(heart => {
        const productCard = heart.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('.product-name').innerText;
            if (wishlist.some(item => item.name === productName)) {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                heart.style.color = "#d98888";
            }
        }
    });

    heartButtons.forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = heart.closest('.product-card');
            if (!productCard) return;

            const productName = productCard.querySelector('.product-name').innerText;
            const productPrice = productCard.querySelector('.product-price').innerText;
            const productImage = productCard.querySelector('.product-img-box img').src;

            const itemObj = { 
                name: productName, 
                price: productPrice, 
                image: productImage 
            };

            if (heart.classList.contains('fa-regular')) {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                heart.style.color = "#d98888";
                wishlist.push(itemObj);
            } else {
                heart.classList.remove('fa-solid');
                heart.classList.add('fa-regular');
                heart.style.color = "#a0a0a0";
                wishlist = wishlist.filter(item => item.name !== productName);
            }

            localStorage.setItem('decorify_wishlist', JSON.stringify(wishlist));
        });
    });

    // ==========================================
    // 4. LOGIN / REGISTER MODAL POPUP SYSTEM
    // ==========================================
    const loginLink = document.querySelector('a[href*="Login"], a[href*="login"], .top-links a:last-child');
    const loginModal = document.getElementById('login-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginLink && loginModal) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('open');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            loginModal.classList.remove('open');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('open');
        }
    });

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Logged in successfully!");
            loginModal.classList.remove('open');
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Account created successfully!");
            loginModal.classList.remove('open');
        });
    }

    // ==========================================
    // 5. MODERN LIVE OVERLAY & DROPDOWN SEARCH SYSTEM
    // ==========================================
    const searchBtn = document.getElementById('search-trigger-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const modernSearchInput = document.getElementById('modern-search-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const allProducts = document.querySelectorAll('.product-card');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.style.opacity = "1";
            searchOverlay.style.pointerEvents = "auto";
            setTimeout(() => {
                if(modernSearchInput) modernSearchInput.focus();
            }, 200);
        });
    }

    const closeOverlay = () => {
        if (searchOverlay) {
            searchOverlay.style.opacity = "0";
            searchOverlay.style.pointerEvents = "none";
            if(modernSearchInput) modernSearchInput.value = ""; 
            if(suggestionsBox) suggestionsBox.style.display = "none"; 
        }
    };

    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', closeOverlay);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeOverlay();
    });

    if (modernSearchInput && suggestionsBox) {
        modernSearchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase().trim();
            suggestionsBox.innerHTML = ""; 

            if (keyword === "") {
                suggestionsBox.style.display = "none";
                allProducts.forEach(card => card.style.display = "block");
                return;
            }

            let matches = [];

            allProducts.forEach(card => {
                const productName = card.querySelector('.product-name').innerText;
                if (productName.toLowerCase().includes(keyword)) {
                    matches.push(productName);
                }
            });

            if (matches.length > 0) {
                suggestionsBox.style.display = "block";
                
                matches.forEach(name => {
                    const div = document.createElement('div');
                    div.innerText = name;
                    div.style.padding = "12px 20px";
                    div.style.cursor = "pointer";
                    div.style.fontSize = "16px";
                    div.style.color = "#444";
                    div.style.borderBottom = "1px solid #faf5f5";
                    div.style.transition = "background 0.2s";

                    div.addEventListener('mouseenter', () => div.style.background = "#fff5f5");
                    div.addEventListener('mouseleave', () => div.style.background = "transparent");

                    div.addEventListener('click', () => {
                        modernSearchInput.value = name; 
                        suggestionsBox.style.display = "none"; 
                        
                        allProducts.forEach(card => {
                            if (card.querySelector('.product-name').innerText === name) {
                                card.style.display = "block";
                            } else {
                                card.style.display = "none";
                            }
                        });
                        
                        closeOverlay(); 
                    });

                    suggestionsBox.appendChild(div);
                });
            } else {
                suggestionsBox.style.display = "block";
                const noResult = document.createElement('div');
                noResult.innerText = "No matching items found ✿";
                noResult.style.padding = "12px 20px";
                noResult.style.color = "#999";
                noResult.style.fontStyle = "italic";
                suggestionsBox.appendChild(noResult);
            }

            allProducts.forEach(card => {
                const productName = card.querySelector('.product-name').innerText;
                if (productName.toLowerCase().includes(keyword)) {
                    card.style.display = "block";   
                } else {
                    card.style.display = "none";
                }
            });
        });
    }
});
// ==========================================
// 7. MOBILE RESPONSIVE HAMBURGER MENU (FORCED DIRECT CLICK)
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navbarLinks = document.getElementById('navbar-links');

if (mobileMenuBtn && navbarLinks) {
    // Direct handler lagaya taaki kisi bhi tarah click miss na ho
    mobileMenuBtn.onclick = function(e) {
        e.stopPropagation(); // Taaki document click isko band na kare
        
        navbarLinks.classList.toggle('active');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (navbarLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark'; // Bars se X icon ban jaye
                icon.style.color = "#d98888"; 
            } else {
                icon.className = 'fa-solid fa-bars'; // Wapas bars ban jaye
                icon.style.color = "#555555";
            }
        }
    };

    // Menu ke bahar kahin bhi click ho toh menu band ho jaye
    document.onclick = function(e) {
        if (!navbarLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navbarLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-bars';
                icon.style.color = "#555555";
            }
        }
    };
}