// checkout.js
import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { checkoutItemTemplate } from "./checkoutTemplates.mjs";

loadHeaderFooter();

// 1) Load cart items from localStorage
const cartItems = getLocalStorage("so-cart") || [];

// 2) Render items in the summary list
const itemsContainer = document.querySelector("#checkout-items");

if (itemsContainer) {
  if (!cartItems.length) {
    itemsContainer.innerHTML =
      "<p>Your cart is empty. Please add some items before checking out.</p>";
  } else {
    itemsContainer.innerHTML = cartItems.map(checkoutItemTemplate).join("");
  }
}

// 3) Initialize CheckoutProcess to calculate subtotal and item count
const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

// 4) When ZIP loses focus, calculate full totals (tax + shipping + total)
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}

// 5) Handle form submit: build order and send to server
const form = document.getElementById("checkoutForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    checkout.calculateOrderTotal();

    try {
      const result = await checkout.checkout(form);
      console.log("✅ Order submitted successfully:", result);

      localStorage.removeItem("so-cart");
      window.location.href = "../Thankyou/index.html";
    } catch (err) {
      console.error("❌ Order Error:", err);

      let message =
        "There was a problem submitting your order. Please digit 1234123412341234 in your card information and try again.";

      if (err.message && err.message.includes("Invalid Card Number")) {
        message =
          "Invalid card number. Please use 1234123412341234 and try again.";
      }

      alert(message);
    }
  });

}




