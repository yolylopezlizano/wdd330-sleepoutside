import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { checkoutItemTemplate } from "./checkoutTemplates.mjs";

loadHeaderFooter();

// Load cart items
const cartItems = getLocalStorage("so-cart") || [];
const itemsContainer = document.querySelector("#checkout-items");

if (itemsContainer) {
  if (!cartItems.length) {
    itemsContainer.innerHTML =
      "<p>Your cart is empty. Please add some items before checking out.</p>";
  } else {
    itemsContainer.innerHTML = cartItems.map(checkoutItemTemplate).join("");
  }
}

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

// Recalculate totals when ZIP changes
const zipInput = document.querySelector("#zip");
if (zipInput) {
  zipInput.addEventListener("blur", () => {
    checkout.calculateOrderTotal();
  });
}

const form = document.getElementById("checkoutForm");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearErrors();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    checkout.calculateOrderTotal();

    try {
      const result = await checkout.checkout(form);
      console.log("Order submitted successfully:", result);

      localStorage.removeItem("so-cart");
      window.location.href = "./success.html";
    } catch (err) {
      console.error("Order Error:", err);
      
      clearErrors();

      if (err.name === "servicesError") {
        showErrors(err.message);
      } else {
        alertMessage("There was a problem submitting your order. Please try again.");
      }
    }
  });
}

// -------------------------
// ERROR UI HELPERS
// -------------------------

function clearErrors() {
  const container = document.querySelector(".form-errors");
  if (container) {
    container.innerHTML = "";
    container.classList.remove("active");
  }
}

function showErrors(errorObj) {
  const container = document.querySelector(".form-errors");
  if (!container) return;

  container.innerHTML = "";

  for (const key in errorObj) {
    const p = document.createElement("p");
    p.textContent = errorObj[key];
    p.classList.add("error-message");
    container.appendChild(p);
  }

  container.classList.add("active");
}




