import ProductData from "./ProductData.mjs";
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("product");
}

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

function addProductToCart(product) {
  let cartItems = getLocalStorage("so-cart") || [];

  const existingIndex = cartItems.findIndex((item) => item.Id === product.Id);

  if (existingIndex > -1) {
    cartItems[existingIndex].quantity =
      (cartItems[existingIndex].quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cartItems.push(product);
  }

  setLocalStorage("so-cart", cartItems);
}

function addToCartHandler(product) {
  const button = document.getElementById("addToCart");
  if (button) {
    button.addEventListener("click", () => {
      addProductToCart(product);
      alert(`${product.Name} added to cart!`);
    });
  }
}

async function init() {
  const productId = getProductId();
  const dataSource = new ProductData("tents");

  try {
    const product = await dataSource.findProductById(productId);
    console.log("ID found in URL:", productId);
    console.log("Product found:", product);

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
