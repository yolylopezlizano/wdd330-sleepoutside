// cart.js
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function normalizeCart(raw) {
  const combined = [];
  (raw || []).forEach((item) => {
    if (!item) return;
    const idx = combined.findIndex((p) => p.Id === item.Id);
    const addQty = item.quantity ? Number(item.quantity) : 1;
    if (idx > -1) {
      combined[idx].quantity = (combined[idx].quantity || 1) + addQty;
    } else {
      combined.push({ ...item, quantity: addQty });
    }
  });
  return combined;
}

function readCart() {
  return normalizeCart(getLocalStorage("so-cart") || []);
}

function saveCart(items) {
  setLocalStorage("so-cart", items);
}

// --- render ---
function renderCartContents() {
  const cartItems = readCart();
  const listEl = document.querySelector(".product-list");

  if (!cartItems.length) {
    listEl.innerHTML = "<p>Your cart is empty.</p>";
    clearCartTotal();
    return;
  }

  const htmlItems = cartItems
    .filter((item) => item && item.Image) 
    .map((item) => cartItemTemplate(item))
    .join("");

  listEl.innerHTML = htmlItems;

  displayCartTotal(cartItems);
  attachRemoveListeners(); // 
}

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <button class="remove-btn" data-id="${item.Id}">Remove</button>
    </li>
  `;
}

// --- total ---
function clearCartTotal() {
  const old = document.querySelector(".cart-total");
  if (old) old.remove();
}

function displayCartTotal(cartItems) {
  clearCartTotal();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice) * (item.quantity || 1),
    0
  );
  const formattedTotal = total.toFixed(2);

  const totalSection = document.createElement("div");
  totalSection.classList.add("cart-total");
  totalSection.innerHTML = `
    <hr>
    <h3>Total: $${formattedTotal}</h3>
    <button id="checkoutButton" class="checkout-btn">Proceed to Checkout</button>
  `;

  document.querySelector("main").appendChild(totalSection);

  document.getElementById("checkoutButton").addEventListener("click", () => {
  window.location.href = "../checkout/index.html";
  });

}

// --- remover ---
function removeFromCart(productId) {
  const cart = readCart();
  const idx = cart.findIndex((p) => p.Id === productId);
  if (idx === -1) return;

  const currentQty = cart[idx].quantity || 1;
  if (currentQty > 1) {
    cart[idx].quantity = currentQty - 1;
  } else {
    cart.splice(idx, 1);
  }

  saveCart(cart);
  renderCartContents(); 
}

function attachRemoveListeners() {
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.id;
      removeFromCart(productId);
    });
  });
}

function initCart() {
  renderCartContents();
}
initCart();
