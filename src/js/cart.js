import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // Adjust the image path depending on the file location
  let imagePath = item.Image;

  // If the image path is not an absolute URL and not already correct
  if (!imagePath.startsWith("http")) {
    // Fix relative paths to work correctly from /cart/ folder
    imagePath = imagePath.replace(/^(\.\.\/)+/, "../");
  }

  // HTML template for each item in the cart
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${imagePath}"
        alt="${item.Name}"
      />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;

  return newItem;
}

// Render the cart when the page loads
renderCartContents();