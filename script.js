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
// 3. DYNAMIC WISHLIST (LIKE) SYSTEM - DIRECT CLICK
// ==========================================
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation(); // Block clicks from propagating

        const heartIcon = btn.querySelector('i');
        if (!heartIcon) return;

        // Visual Toggle (Product Cards and Header Heart)
        if (heartIcon.classList.contains('fa-regular')) {
            heartIcon.className = 'fa-solid fa-heart';
            heartIcon.style.color = "#d98888";
            console.log("❤️ Wishlist: Item Added.");
        } else {
            heartIcon.className = 'fa-regular fa-heart';
            heartIcon.style.color = "#a0a0a0";
            console.log("🤍 Wishlist: Item Removed.");
        }

        // Optional: LocalStorage update for product cards
        const productCard = btn.closest('.product-card');
        if (productCard) {
            const productName = productCard.querySelector('.product-name').innerText;
            const productImage = productCard.querySelector('.product-img-box img').src;
            const productPrice = productCard.querySelector('.product-price').innerText;

            let currentWishlist = JSON.parse(localStorage.getItem('decorify_wishlist')) || [];
            
            if (heartIcon.classList.contains('fa-solid')) {
                currentWishlist.push({name: productName, price: productPrice, image: productImage});
            } else {
                currentWishlist = currentWishlist.filter(item => item.name !== productName);
            }
            localStorage.setItem('decorify_wishlist', JSON.stringify(currentWishlist));
        }
    };
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

    // ==========================================
    // 7. MOBILE RESPONSIVE HAMBURGER MENU (INSIDE DOMContentLoaded)
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarLinks = document.getElementById('navbar-links');

    if (mobileMenuBtn && navbarLinks) {
        mobileMenuBtn.onclick = function(e) {
            e.stopPropagation(); 
            
            navbarLinks.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navbarLinks.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark'; 
                    icon.style.color = "#d98888"; 
                } else {
                    icon.className = 'fa-solid fa-bars'; 
                    icon.style.color = "#555555";
                }
            }
        };

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

}); // DOMContentLoaded closing bracket bilkul sahi end par

// ==========================================
// FOOTER NEWSLETTER SUBSCRIPTION SYSTEM
// ==========================================
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');
const newsletterMessage = document.getElementById('newsletter-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Page ko refresh hone se rokne ke liye

        const emailValue = newsletterEmail.value.trim();

        if (emailValue !== "") {
            // 1. LocalStorage mein subscriber email save karna
            let subscribers = JSON.parse(localStorage.getItem('decorify_subscribers')) || [];
            
            // Check karna ke kahin yeh email pehle se subscribed toh nahi
            if (!subscribers.includes(emailValue)) {
                subscribers.push(emailValue);
                localStorage.setItem('decorify_subscribers', JSON.stringify(subscribers));
            }

            // 2. Screen par success message dikhana
            newsletterMessage.textContent = "Thank you for subscribing! ✿";
            newsletterMessage.style.color = "#fff"; // Rose/white theme ke mutabiq text color
            newsletterMessage.style.display = "block";

            // 3. Input field ko khali karna
            newsletterEmail.value = "";

            // 4. 4 seconds baad message ko gayab karna
            setTimeout(() => {
                newsletterMessage.style.display = "none";
            }, 4000);
        }
    });
}