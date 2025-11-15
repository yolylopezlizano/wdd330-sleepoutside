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

    // Leer carrito desde localStorage
    const stored = getLocalStorage(this.key) || [];

    // Combinar y sumar cantidades
    this.cartItems = this.normalize(stored);

    // Guardar carrito ya normalizado
    setLocalStorage(this.key, this.cartItems);

    // Renderizar carrito
    this.render();
  }

  // ⭐ Combina duplicados y suma cantidades sin perder nada
  normalize(items) {
    const combined = [];

    items.forEach((item) => {
      if (!item) return;

      const found = combined.find((p) => p.Id === item.Id);

      if (found) {
        found.quantity += item.quantity || 1;  // ⭐ Aquí suma correctamente
      } else {
        combined.push({
          ...item,
          quantity: item.quantity || 1,  // ⭐ Si no tiene quantity, le pone 1
        });
      }
    });

    return combined;
  }

  render() {
    if (!this.listElement) return;

    this.listElement.innerHTML = "";

    if (this.cartItems.length === 0) {
      this.listElement.innerHTML = "<p>Your cart is empty.</p>";
      this.removeTotalSection();
      return;
    }

    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      this.cartItems,
      "beforeend"
    );

    this.renderTotal();
    this.enableRemoveButtons();
  }

  renderTotal() {
    let totalContainer = document.querySelector(".cart-total");

    if (!totalContainer) {
      totalContainer = document.createElement("div");
      totalContainer.classList.add("cart-total");
      document.querySelector("main").appendChild(totalContainer);
    }

    const total = this.cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * item.quantity,
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

  removeTotalSection() {
    const totalContainer = document.querySelector(".cart-total");
    if (totalContainer) totalContainer.remove();
  }

  enableRemoveButtons() {
    this.listElement.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.removeItem(id);
      });
    });
  }

  removeItem(productId) {
    const index = this.cartItems.findIndex(
      (item) => item.Id.toLowerCase() === productId.toLowerCase()
    );

    if (index === -1) return;

    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity -= 1; // 🔥 RESTA SOLO 1
    } else {
      this.cartItems.splice(index, 1); // ❌ Remove product
    }

    setLocalStorage(this.key, this.cartItems);
    this.render();
  }
}
