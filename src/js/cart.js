import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // Normalize the image path
  let imagePath = item.Image;

  // If imagePath starts with "../", remove the first two dots so it points correctly
  if (imagePath.startsWith("../")) {
    imagePath = imagePath.replace("../", "");
  }

  // Make sure the final path points to the right location
  imagePath = "/" + imagePath;

  // If the image still doesn't load, show a fallback image
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img
        src="${imagePath}"
        alt="${item.Name}"
        onerror="this.src='../images/no-image.jpg'"
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