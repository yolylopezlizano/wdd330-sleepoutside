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
      // 🧩 Buscar producto por ID
      this.product = await this.dataSource.findProductById(this.productId);

      // Renderizar los detalles
      this.renderProductDetails();

      // 🛒 Listener para añadir al carrito
      const addToCartBtn = document.getElementById("addToCart");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", this.addToCart.bind(this));
      }
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
    if (!container) return;

    // 🖼️ Imagen segura (usa no-image si no hay)
    const imageSrc =
      this.product.Image &&
      typeof this.product.Image === "string" &&
      this.product.Image.trim() !== "" &&
      !this.product.Image.toLowerCase().includes("undefined") &&
      !this.product.Image.toLowerCase().includes("missing")
        ? this.product.Image.replace("../", "/")
        : "/images/no-image.png";

    // 🧱 Render del contenido del producto
    container.innerHTML = `
      <h3>${this.product.Brand?.Name || "Unknown Brand"}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand || "Unnamed Product"}</h2>

      <img 
        class="divider" 
        src="${imageSrc}" 
        alt="${this.product.Name || "Product Image"}"
        onerror="this.src='/images/no-image.png'; this.onerror=null;"
      >

      <p class="product-card__price">$${this.product.FinalPrice || "0.00"}</p>
      <p class="product__color">${this.product.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple || "No description available."}</p>

      <div class="product-detail__add">
        <button id="addToCart">Add to Cart</button>
      </div>
    `;
  }
}
