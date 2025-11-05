// ProductDetails.mjs
// This module dynamically loads and displays a single product's details.

import ProductData from "./ProductData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

// ✅ 1. Get product ID from URL parameters (?product=ID)
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("product");
}

// ✅ 2. Render the selected product details on the page
function renderProductDetails(product) {
  const productSection = document.querySelector(".product-detail");

  productSection.innerHTML = `
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image.replace("../", "/")}" alt="${product.Name}" />
    <p class="product-card__price">$${product.FinalPrice}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
      <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
  `;
}

// ✅ 3. Add selected product to the shopping cart (localStorage)
function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
}

// ✅ 4. Handle click on "Add to Cart" button
function addToCartHandler(product) {
  const button = document.getElementById("addToCart");
  if (button) {
    button.addEventListener("click", () => {
      addProductToCart(product);
      alert(`${product.Name} added to cart!`);
    });
  }
}

// ✅ 5. Main function — runs when the page loads
async function init() {
  const productId = getProductId();
  const dataSource = new ProductData("tents");

  try {
    const product = await dataSource.findProductById(productId);
    console.log("ID encontrado en URL:", productId);
    console.log("Producto encontrado:", product);

    if (product) {
      renderProductDetails(product);
      addToCartHandler(product);
    } else {
      document.querySelector(".product-detail").innerHTML =
        "<p>Sorry, product not found.</p>";
    }
  } catch (error) {
    console.error("Error loading product:", error);
    document.querySelector(".product-detail").innerHTML =
      "<p>There was an error loading the product.</p>";
  }
}

init();

