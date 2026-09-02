/* =========================================
   ECW - CART
========================================= */


/* =========================================
   GET CART
========================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("ecwCart")
    ) || [];

}


/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {

    localStorage.setItem(
        "ecwCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   DISPLAY CART
========================================= */

function displayCart() {

    const cartItems =
        document.getElementById("cartItems");


    if (!cartItems) return;


    let cart = getCart();


    /*
       Remove invalid old cart items
    */

    cart = cart.filter(item => {

        return (
            item &&
            item.id &&
            item.name &&
            typeof item.price === "number" &&
            item.quantity > 0
        );

    });


    saveCart(cart);


    cartItems.innerHTML = "";


    /* EMPTY CART */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty">

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    Add some products to your cart.
                </p>

                <a
                    href="products.html"
                    class="btn">

                    Continue Shopping

                </a>

            </div>

        `;


        updateSummary(0, 0, 0);

        updateCartCount();

        return;

    }


    /* DISPLAY ITEMS */

    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    class="cart-item-image"
                >


                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>


                    <p>
                        ₹${item.price.toLocaleString("en-IN")}
                    </p>


                    <div class="quantity-controls">

                        <button
                            onclick="decreaseQuantity(${item.id})">

                            −

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="increaseQuantity(${item.id})">

                            +

                        </button>

                    </div>


                    <p class="item-total">

                        ₹${itemTotal.toLocaleString("en-IN")}

                    </p>


                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})">

                        Remove

                    </button>

                </div>

            </div>

        `;

    });


    calculateTotal();

    updateCartCount();

}


/* =========================================
   INCREASE QUANTITY
========================================= */

function increaseQuantity(productId) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (item) {

        item.quantity++;

    }


    saveCart(cart);

    displayCart();

}


/* =========================================
   DECREASE QUANTITY
========================================= */

function decreaseQuantity(productId) {

    const cart = getCart();


    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeFromCart(productId);

        return;

    }


    saveCart(cart);

    displayCart();

}


/* =========================================
   REMOVE PRODUCT
========================================= */

function removeFromCart(productId) {

    let cart = getCart();


    cart = cart.filter(
        item => item.id !== productId
    );


    saveCart(cart);

    displayCart();

}


/* =========================================
   CALCULATE TOTAL
========================================= */

function calculateTotal() {

    const cart = getCart();


    const subtotal =
        cart.reduce(
            (total, item) =>
                total +
                item.price * item.quantity,
            0
        );


    let shipping = 0;


    if (
        subtotal > 0 &&
        subtotal < 2000
    ) {

        shipping = 100;

    }


    const total =
        subtotal + shipping;


    updateSummary(
        subtotal,
        shipping,
        total
    );

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary(
    subtotal = 0,
    shipping = 0,
    total = 0
) {

    const cartSubtotal =
        document.getElementById("cartSubtotal");


    const cartShipping =
        document.getElementById("cartShipping");


    const cartTotal =
        document.getElementById("cartTotal");


    if (cartSubtotal) {

        cartSubtotal.textContent =
            `₹${subtotal.toLocaleString("en-IN")}`;

    }


    if (cartShipping) {

        cartShipping.textContent =
            shipping === 0
                ? "FREE"
                : `₹${shipping.toLocaleString("en-IN")}`;

    }


    if (cartTotal) {

        cartTotal.textContent =
            `₹${total.toLocaleString("en-IN")}`;

    }

}


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const cart = getCart();


    const count =
        cart.reduce(
            (total, item) =>
                total +
                (Number(item.quantity) || 0),
            0
        );


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = count;

        });

}


/* =========================================
   INITIALIZE
========================================= */

displayCart();

updateCartCount();