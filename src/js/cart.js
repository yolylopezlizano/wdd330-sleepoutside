// cart.js
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function normalizeCart(raw) {
  const combined = [];
  (raw || []).forEach((item) => {
    if (!item) return;
    const idx = combined.findIndex((p) => p.Id == item.Id); // 🔹 usa == para evitar fallo tipo string/number
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

  // 👉 sin filter, para que todos los items se muestren y todos tengan su X
  listEl.innerHTML = cartItems.map(cartItemTemplate).join("");

  displayCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const imageSrc =
    item.Image &&
    typeof item.Image === "string" &&
    item.Image.trim() !== "" &&
    !item.Image.toLowerCase().includes("undefined") &&
    !item.Image.toLowerCase().includes("missing")
      ? item.Image.replace("../", "/")
      : "/images/no-image.png";

  return `
    <li class="cart-card divider">
      <!-- 👇 ESTA LÍNEA CREA LA X -->
      <button class="remove-btn" data-id="${item.Id}" title="Remove item">✕</button>

      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img 
          src="${imageSrc}" 
          alt="${item.Name}" 
          onerror="this.src='/images/no-image.png'; this.onerror=null;"
        >
      </a>

      <h2 class="card__name">${item.NameWithoutBrand}</h2>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">Qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
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
  let cart = readCart();
  const idx = cart.findIndex((p) => p.Id == productId);
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


function attachRemoveListenersOnce() {
  const list = document.querySelector(".product-list");
  if (!list) return;
  // evita duplicados: elimina un listener previo si lo tenías (opcional si no lo usaste antes)
  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
    }
  }, { once: false });
}

function initCart() {
  attachRemoveListenersOnce();   // 👈 solo una vez
  renderCartContents();
}
initCart();

