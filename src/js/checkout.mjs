import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
loadHeaderFooter();

function renderCheckout() {
  const cartItems = getLocalStorage("so-cart") || [];
  const main = document.querySelector("main");

  if (cartItems.length === 0) {
    main.innerHTML += "<p>Your cart is empty. Add some items first!</p>";
    return;
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
    0
  );

  const formattedTotal = total.toFixed(2);

  const list = cartItems
    .map(
      (item) => `
      <li>
        <img 
          src="${
            item.Image &&
            !item.Image.includes("undefined") &&
            !item.Image.includes("missing")
              ? item.Image.replace("../", "/")
              : "/images/no-image.png"
          }" 
          alt="${item.Name}" 
          width="80"
          onerror="this.src='/images/no-image.png'; this.onerror=null;"
        >
        ${item.Name} — qty: ${item.quantity || 1} — $${item.FinalPrice}
      </li>`
    )
    .join("");

  main.innerHTML += `
    <ul>${list}</ul>
    <div class="cart-total">
      <h3>Total: $${formattedTotal}</h3>
      <button id="placeOrder" class="checkout-btn">Place Order</button>
    </div>
  `;

  // 🧹 Clear cart and redirect after placing order
  document.getElementById("placeOrder").addEventListener("click", () => {
    localStorage.removeItem("so-cart");
    window.location.href = "../Thankyou/index.html";
  });
}

renderCheckout();

