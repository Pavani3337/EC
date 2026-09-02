/* =========================================
   ECW - APP.JS
   Common + Checkout Functionality
========================================= */


/* =========================================
   UPDATE CART COUNT
========================================= */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("ecwCart")
        ) || [];


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
   GET CART
========================================= */

function getAppCart() {

    return JSON.parse(
        localStorage.getItem("ecwCart")
    ) || [];

}


/* =========================================
   CALCULATE CART TOTAL
========================================= */

function getCartTotal() {

    const cart = getAppCart();


    return cart.reduce(
        (total, item) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Number(item.quantity) || 0;

            return total + (price * quantity);

        },
        0
    );

}


/* =========================================
   CHECKOUT
========================================= */

function initializeCheckout() {

    const checkoutTotal =
        document.getElementById("checkoutTotal");


    const checkoutForm =
        document.getElementById("checkoutForm");


    /*
       If this is not the Checkout page,
       stop here.
    */

    if (!checkoutTotal || !checkoutForm) {

        return;

    }


    /* GET CART */

    const cart = getAppCart();


    /* CALCULATE TOTAL */

    const total = getCartTotal();


    /* DISPLAY TOTAL */

    checkoutTotal.textContent =
        `₹${total.toLocaleString("en-IN")}`;


    /* UPDATE NAVBAR */

    updateCartCount();


    /* =====================================
       EMPTY CART
    ===================================== */

    if (cart.length === 0) {

        checkoutTotal.textContent = "₹0";


        const button =
            checkoutForm.querySelector(
                "button[type='submit']"
            );


        if (button) {

            button.disabled = true;

            button.textContent =
                "Cart is Empty";

        }


        return;

    }


    /* =====================================
       FORM SUBMISSION
    ===================================== */

    checkoutForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Recalculate total */

            const currentTotal =
                getCartTotal();


            if (currentTotal <= 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            /* GET FORM DATA */

            const formData =
                new FormData(checkoutForm);


            const customer = {

                name:
                    formData.get("name"),

                phone:
                    formData.get("phone"),

                address:
                    formData.get("address"),

                city:
                    formData.get("city"),

                pincode:
                    formData.get("pincode")

            };


            /* SAVE CHECKOUT DETAILS */

            localStorage.setItem(
                "ecwCheckout",
                JSON.stringify({

                    customer: customer,

                    items: cart,

                    total: currentTotal,

                    date:
                        new Date().toISOString()

                })
            );


            /*
               Payment gateway will be
               connected in the next step.
            */

            alert(
                "Delivery details saved. Ready for payment."
            );



	window.location.href = "payment.html";

            /*
               For now we don't redirect
               to payment-success.html.

               The actual payment gateway
               will be connected next.
            */

        }
    );

}






/* =========================================
   CREATE ORDER
========================================= */

function createOrder() {

    const checkoutData =
        JSON.parse(
            localStorage.getItem("ecwCheckout")
        );

    const paymentData =
        JSON.parse(
            localStorage.getItem("ecwPayment")
        );


    if (!checkoutData || !paymentData) {

        return null;

    }


    /* Get existing orders */

    let orders =
        JSON.parse(
            localStorage.getItem("ecwOrders")
        ) || [];


    /* Create unique order ID */

    const orderId =
        "ECW" +
        Date.now();


    const order = {

        id: orderId,

        customer:
            checkoutData.customer,

        items:
            checkoutData.items,

        total:
            checkoutData.total,

        paymentMethod:
            paymentData.method,

        paymentStatus:
            paymentData.status,

        orderStatus:
            "Confirmed",

        date:
            new Date().toISOString()

    };


    /* Add order */

    orders.push(order);


    /* Save orders */

    localStorage.setItem(
        "ecwOrders",
        JSON.stringify(orders)
    );


    return order;

}







/* =========================================
   PAGE INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        initializeCheckout();

        initializePayment();

        displayOrders();

    }
);





/* =========================================
   PAYMENT PAGE
========================================= */

function initializePayment() {

    const paymentTotal =
        document.getElementById("paymentTotal");

    const payButton =
        document.getElementById("payButton");


    /* If not payment page */

    if (!paymentTotal || !payButton) {

        return;

    }


    /* Get checkout data */

    const checkoutData =
        JSON.parse(
            localStorage.getItem("ecwCheckout")
        );


    /* No checkout data */

    if (!checkoutData) {

        alert(
            "Checkout information not found."
        );

        window.location.href =
            "cart.html";

        return;

    }


    /* Display total */

    paymentTotal.textContent =
        `₹${checkoutData.total.toLocaleString("en-IN")}`;


    /* Update cart count */

    updateCartCount();


    /* Pay button */

    payButton.addEventListener(
        "click",
        function () {

            const selectedMethod =
                document.querySelector(
                    'input[name="paymentMethod"]:checked'
                );


            if (!selectedMethod) {

                alert(
                    "Please select a payment method."
                );

                return;

            }


            const method =
                selectedMethod.value;


            /*
                Temporary payment simulation.

                Real Razorpay integration
                will be added next.
            */

            alert(
                `Payment method selected: ${method.toUpperCase()}`
            );


            /* Save payment information */

            localStorage.setItem(
    "ecwPayment",
    JSON.stringify({

        method: method,

        amount:
            checkoutData.total,

        status:
            "success",

        date:
            new Date().toISOString()

    })
);


createOrder();


            /*
                For now go to payment success.
                Later Razorpay will decide
                success/failure.
            */

            window.location.href =
                "payment-success.html";

        }
    );

}








/* =========================================
   DISPLAY ORDERS
========================================= */

function displayOrders() {

    const ordersList =
        document.getElementById("ordersList");


    /* Not Orders page */

    if (!ordersList) {

        return;

    }


    /* Get orders */

    const orders =
        JSON.parse(
            localStorage.getItem("ecwOrders")
        ) || [];


    /* No orders */

    if (orders.length === 0) {

        ordersList.innerHTML = `

            <div class="empty">

                <h2>
                    No Orders Yet
                </h2>

                <p>
                    You have not placed any orders yet.
                </p>

                <a
                    href="products.html"
                    class="btn"
                >
                    Start Shopping
                </a>

            </div>

        `;

        return;

    }


    /* Display orders */

    ordersList.innerHTML = "";


    orders
        .slice()
        .reverse()
        .forEach(order => {

            const orderDate =
                new Date(order.date);


            let itemsHTML = "";


            order.items.forEach(item => {

                itemsHTML += `

                    <div class="order-item">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                        <div>

                            <h4>
                                ${item.name}
                            </h4>

                            <p>
                                ₹${Number(item.price)
                                    .toLocaleString("en-IN")}
                                ×
                                ${item.quantity}
                            </p>

                        </div>

                    </div>

                `;

            });


            ordersList.innerHTML += `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h2>
                                Order #${order.id}
                            </h2>

                            <p>
                                ${orderDate.toLocaleDateString("en-IN")}
                            </p>

                        </div>


                        <span class="order-status">

                            ${order.orderStatus}

                        </span>

                    </div>


                    <div class="order-products">

                        ${itemsHTML}

                    </div>


                    <div class="order-details">

                        <p>

                            <strong>
                                Payment:
                            </strong>

                            ${order.paymentMethod.toUpperCase()}

                        </p>


                        <p>

                            <strong>
                                Payment Status:
                            </strong>

                            ${order.paymentStatus}

                        </p>


                        <p>

                            <strong>
                                Delivery:
                            </strong>

                            ${order.customer.address},
                            ${order.customer.city}
                            -
                            ${order.customer.pincode}

                        </p>

                    </div>


                    <div class="order-total">

                        Total:
                        ₹${Number(order.total)
                            .toLocaleString("en-IN")}

                    </div>

                </div>

            `;

        });

}