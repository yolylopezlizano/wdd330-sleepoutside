import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  // Obtener el contenido actual del carrito o crear un array vacío
  let cart = getLocalStorage("so-cart");

  // Si lo que hay guardado no es un array, lo convertimos
  if (!Array.isArray(cart)) {
    cart = cart ? [cart] : [];
  }

  // Agregar el nuevo producto
  cart.push(product);

  // Guardar nuevamente en localStorage
  setLocalStorage("so-cart", cart);
}

// add to cart button event handler
async function addToCartHandler(e) {
  const id = e.currentTarget.dataset.id;
  if (!id) {
    console.error("El botón Add to Cart no tiene data-id");
    return;
  }
  const product = await dataSource.findProductById(id);
  addProductToCart(product);
  console.log("Producto agregado:", product.Name);
}

// agregar evento al botón
const addButton = document.getElementById("addToCart");
if (addButton) {
  addButton.addEventListener("click", addToCartHandler);
} else {
  console.warn("No se encontró el botón #addToCart en esta página.");
}
