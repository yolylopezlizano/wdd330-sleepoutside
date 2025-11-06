// ProductDetails.mjs
import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      this.product = await this.dataSource.findProductById(this.productId);
      this.renderProductDetails();
      document
        .getElementById("addToCart")
        .addEventListener("click", this.addToCart.bind(this));
    } catch (err) {
      console.error("❌ Error al cargar detalles del producto:", err);
      document.querySelector(".product-detail").innerHTML =
        "<p>Sorry, there was a problem loading this product.</p>";
    }
  }

  addToCart() {
    const cart = getLocalStorage("so-cart") || [];
    cart.push(this.product);
    setLocalStorage("so-cart", cart);
    alert(`${this.product.Name} added to cart!`);
  }

  renderProductDetails() {
    const container = document.querySelector(".product-detail");

    container.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img class="divider" src="${this.product.Image.replace("../", "/")}" alt="${this.product.Name}">
      <p class="product-card__price">$${this.product.FinalPrice}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart">Add to Cart</button>
      </div>
    `;
  }
}
