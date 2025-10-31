import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // 🔧 Fix: corregir ruta de imagen si viene con "../"
  let imagePath = item.Image;
  if (imagePath.startsWith("../images")) {
    imagePath = imagePath.replace("../images", "/images");
  }

  const newItem = `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imagePath}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;

  return newItem;
}

renderCartContents();
