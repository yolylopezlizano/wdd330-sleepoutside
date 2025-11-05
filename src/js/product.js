import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Get the current cart from localStorage, or create an empty array if none exists
  let cartItems = getLocalStorage("so-cart") || [];

  // If the stored cart is not an array (for example, a single object), fix it
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }

  // Add the new product to the cart array
  cartItems.push(product);

  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cartItems);
}

// Event handler for the "Add to Cart" button
async function addToCartHandler(e) {
  // Find the product details using the product ID from the button
  const product = await dataSource.findProductById(e.target.dataset.id);

  // Add the product to the cart
  addProductToCart(product);
}

// Attach the event listener to the "Add to Cart" button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

