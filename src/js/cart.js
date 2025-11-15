import ShoppingCart from "./ShoppingCart.mjs";
import { loadHeaderFooter } from "../js/utils.mjs";

loadHeaderFooter();

const listElement = document.querySelector(".product-list");

const cart = new ShoppingCart("so-cart", listElement);

cart.init();


