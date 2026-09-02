/* =========================================
   ECW - PRODUCTS
========================================= */


/* =========================================
   PRODUCT DATA
========================================= */

const products = [

    {
        id: 1,
        name: "iPhone 15",
        category: "Mobiles",
        price: 59999,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
        description:
            "Powerful smartphone with excellent performance and camera."
    },

    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "Mobiles",
        price: 74999,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
        description:
            "Premium smartphone with a beautiful display and powerful processor."
    },

    {
        id: 3,
        name: "HP Pavilion Laptop",
        category: "Laptops",
        price: 65999,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
        description:
            "Reliable laptop suitable for students and professionals."
    },

    {
        id: 4,
        name: "MacBook Air",
        category: "Laptops",
        price: 99999,
        image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
        description:
            "Slim and powerful laptop with excellent performance."
    },

    {
        id: 5,
        name: "Apple Watch",
        category: "Watches",
        price: 42999,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
        description:
            "Smart watch with fitness tracking and smart features."
    },

    {
        id: 6,
        name: "Running Shoes",
        category: "Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
        description:
            "Comfortable running shoes designed for everyday use."
    },

    {
        id: 7,
        name: "Wireless Headphones",
        category: "Accessories",
        price: 2999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        description:
            "Wireless headphones with clear sound and comfortable design."
    },

    {
        id: 8,
        name: "Smart Backpack",
        category: "Accessories",
        price: 1999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
        description:
            "Stylish and spacious backpack for college and office use."
    },

    {
        id: 9,
        name: "Gaming Mouse",
        category: "Accessories",
        price: 1499,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
        description:
            "High precision gaming mouse with ergonomic design."
    },

    {
        id: 10,
        name: "Bluetooth Speaker",
        category: "Accessories",
        price: 1799,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
        description:
            "Portable Bluetooth speaker with powerful sound."
    }

];


/* =========================================
   PRODUCT LIST
========================================= */

const productList =
    document.getElementById("productList");


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts(productArray) {

    if (!productList) return;

    productList.innerHTML = "";


    if (productArray.length === 0) {

        productList.innerHTML = `

            <div class="empty">

                <h2>No Products Found</h2>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    productArray.forEach(product => {

        productList.innerHTML += `

            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-content">

                    <span class="product-category">
                        ${product.category}
                    </span>


                    <h3 class="product-title">
                        ${product.name}
                    </h3>


                    <p class="product-description">
                        ${product.description}
                    </p>


                    <div class="product-price">

                        ₹${product.price.toLocaleString("en-IN")}

                    </div>


                    <div class="product-actions">

                        <button
                            class="btn"
                            onclick="addToCart(${product.id})">

                            Add to Cart

                        </button>


                        <button
                            class="btn secondary"
                            onclick="viewProduct(${product.id})">

                            View

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* =========================================
   SEARCH
========================================= */

const search =
    document.getElementById("search");


const category =
    document.getElementById("category");


/* =========================================
   FILTER PRODUCTS
========================================= */

function filterProducts() {

    if (!search || !category) return;


    const searchText =
        search.value
            .toLowerCase()
            .trim();


    const selectedCategory =
        category.value;


    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "" ||
                product.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayProducts(filteredProducts);

}


/* =========================================
   SEARCH EVENT
========================================= */

if (search) {

    search.addEventListener(
        "input",
        filterProducts
    );

}


/* =========================================
   CATEGORY EVENT
========================================= */

if (category) {

    category.addEventListener(
        "change",
        filterProducts
    );

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId) {

    let cart =
        JSON.parse(
            localStorage.getItem("ecwCart")
        ) || [];


    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {

        alert("Product not found.");

        return;

    }


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    localStorage.setItem(
        "ecwCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        `${product.name} added to cart!`
    );

}


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
                total + (Number(item.quantity) || 0),
            0
        );


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent = count;

        });

}


/* =========================================
   VIEW PRODUCT
========================================= */

function viewProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;

}


/* =========================================
   INITIALIZE
========================================= */

displayProducts(products);

updateCartCount();