document.addEventListener("DOMContentLoaded", () => {
    // 1. Cart Array Initialize Karein (Pehle se saved items local storage se uthayein)
    let cart = JSON.parse(localStorage.getItem('decorify_cart')) || [];

    // Header Badge update karne ka function
    const updateCartBadge = () => {
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            // Cart mein jitni items hain, unka total count badge par dikhaein
            cartBadge.innerText = cart.length;
        }
    };

    // Page load hote hi badge update karein
    updateCartBadge();

    // 2. Add to Cart Button Click Logic
    const allAddToCartButtons = document.querySelectorAll('.add-cart-btn');

    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Jis button par click hua, uske parent card se product ki details nikalna
            const productCard = e.target.closest('.product-card');
            
            if (productCard) {
                const productName = productCard.querySelector('.product-name').innerText;
                const productPrice = productCard.querySelector('.product-price').innerText;
                const productImage = productCard.querySelector('.product-img-box img').src;

                // Product ka object banana
                const product = {
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                };

                // Check karna ke item pehle se cart mein hai ya nahi
                const existingItemIndex = cart.findIndex(item => item.name === product.name);

                if (existingItemIndex > -1) {
                    // Agar pehle se hai toh quantity barha dein
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Agar naya hai toh array mein add karein
                    cart.push(product);
                }

                // Browser ki LocalStorage mein save karein taaki page refresh par delete na ho
                localStorage.setItem('decorify_cart', JSON.stringify(cart));

                // Badge ka number update karein
                updateCartBadge();

                alert(`${productName} successfully added to your cart!`);
            }
        });
    });

    // 3. Wishlist Heart Icon Toggle (Solid vs Regular)
    const heartButtons = document.querySelectorAll('.wishlist-btn i');
    heartButtons.forEach(heart => {
        heart.addEventListener('click', () => {
            if (heart.classList.contains('fa-regular')) {
                heart.classList.remove('fa-regular');
                heart.classList.add('fa-solid');
                heart.style.color = "#d98888";
            } else {
                heart.classList.remove('fa-solid');
                heart.classList.add('fa-regular');
                heart.style.color = "#a0a0a0";
            }
        });
    });
});