import { saveToCart, updateCartCount, getCartItemCount} from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.element = document.querySelector(".product-detail");
  }

  async init() {
    const product = await this.dataSource.findProductById(this.productId);

    console.log("📦 PRODUCT RECEIVED:", product);

    this.renderProductDetails(product);

    // Safe button selection
    const addButton = this.element.querySelector(".add-to-cart");

    if (addButton) {
      addButton.addEventListener("click", () => {
        saveToCart(product);
        updateCartCount(); // updates counter automatically
      });
    }
  }

  renderProductDetails(product) {
    const imageSrc =
      product.Images?.PrimaryLarge ||
      product.Images?.PrimaryMedium ||
      product.Images?.PrimarySmall ||
      "/images/no-image.png";

    this.element.innerHTML = `
      <div class="product-detail-card">
        <h2>${product.Brand?.Name ?? "Unknown Brand"}</h2>
        <h1>${product.Name}</h1>

        <img src="${imageSrc}" alt="${product.Name}" class="detail-image">

        <p class="price">$${product.FinalPrice}</p>

        <div class="description">
          ${product.DescriptionHtmlSimple}
        </div>

        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
  }
}






