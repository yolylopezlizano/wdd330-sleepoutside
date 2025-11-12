import {
  getLocalStorage,
  setLocalStorage,
  renderListWithTemplate,
  loadHeaderFooter,
} from "./utils.mjs";
import { cartItemTemplate } from "./cartTemplates.mjs";

export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
    this.cartItems = [];
  }

  async init() {
    await loadHeaderFooter();
    const rawCart = getLocalStorage(this.key) || [];
    // 🧩 Combine duplicate items once on init
    this.cartItems = this.normalizeCart(rawCart);
    setLocalStorage(this.key, this.cartItems); // ✅ Save normalized version
    this.renderCart();
  }

  normalizeCart(rawCart) {
    const combined = [];
    rawCart.forEach((item) => {
      if (!item) return;
      const idx = combined.findIndex((p) => p.Id === item.Id);
      if (idx > -1) {
        combined[idx].quantity = (combined[idx].quantity || 1) + 1;
      } else {
        combined.push({ ...item, quantity: item.quantity || 1 });
      }
    });
    return combined;
  }

  renderCart() {
  if (!this.listElement) return;

  // 🧹 Always refresh items directly from storage (no re-normalization)
  this.cartItems = getLocalStorage(this.key) || [];

  // 🧽 Clear the list before rendering new content
  this.listElement.innerHTML = "";

  if (this.cartItems.length === 0) {
    this.listElement.innerHTML = "<p>Your cart is empty.</p>";
    const totalContainer = document.querySelector(".cart-total");
    if (totalContainer) totalContainer.remove();
    return;
  }

  renderListWithTemplate(cartItemTemplate, this.listElement, this.cartItems, "beforeend", false);
  this.renderTotal();

  // 🧩 Add event listeners to remove buttons (after rendering)
  this.listElement.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productId = e.currentTarget.dataset.id;
      this.removeItem(productId);
    });
  });
}

  renderTotal() {
    let totalContainer = document.querySelector(".cart-total");
    if (!totalContainer) {
      totalContainer = document.createElement("div");
      totalContainer.classList.add("cart-total");
      document.querySelector("main").appendChild(totalContainer);
    }

    const total = this.cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0
    );

    totalContainer.innerHTML = `
      <hr>
      <h3>Total: $${total.toFixed(2)}</h3>
      <button id="checkoutButton" class="checkout-btn">Proceed to Checkout</button>
    `;

    document.getElementById("checkoutButton").addEventListener("click", () => {
      window.location.href = "../checkout/index.html";
    });
  }

  removeItem(productId) {
    const index = this.cartItems.findIndex((item) => item.Id === productId);
    if (index > -1) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      } else {
        this.cartItems.splice(index, 1);
      }
    }

    // ✅ Save updated version back to localStorage
    setLocalStorage(this.key, this.cartItems);

    // ♻️ Re-render cart with updated data
    this.renderCart();
  }
}

