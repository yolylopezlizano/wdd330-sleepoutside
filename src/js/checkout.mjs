import { loadHeaderFooter, getLocalStorage } from "./utils.mjs";
import { checkoutItemTemplate } from "./checkoutTemplates.mjs";

loadHeaderFooter();

function renderCheckout() {
  const cartItems = getLocalStorage("so-cart") || [];
  const main = document.querySelector("main");

  if (cartItems.length === 0) {
    main.innerHTML += "<p>Your cart is empty. Add some items first!</p>";
    return;
  }

  // Crear lista UL donde se insertarán los productos
  const ul = document.createElement("ul");
  ul.classList.add("product-list"); // usa el MISMO estilo del cart
  main.appendChild(ul);

  // Renderizar productos
  ul.innerHTML = cartItems.map(checkoutItemTemplate).join("");

  // Calcular total
  const total = cartItems.reduce(
    (sum, item) => sum + item.FinalPrice * item.quantity,
    0
  );

  const formattedTotal = total.toFixed(2);

  // Mostrar total + botón
  main.innerHTML += `
    <div class="cart-total">
      <h3>Total: $${formattedTotal}</h3>
      <button id="placeOrder" class="checkout-btn">Place Order</button>
    </div>
  `;

  // Acción del botón
  document.getElementById("placeOrder").addEventListener("click", () => {
    localStorage.removeItem("so-cart");
    window.location.href = "../Thankyou/index.html";
  });
}

renderCheckout();

