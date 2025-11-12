import ShoppingCart from "./ShoppingCart.mjs";

const listElement = document.querySelector(".product-list");

const cart = new ShoppingCart("so-cart", listElement);

cart.init();


