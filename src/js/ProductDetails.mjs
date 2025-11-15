import { saveToCart } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.element = document.querySelector(".product-detail");
  }

  async init() {
    const product = await this.dataSource.findProductById(this.productId);

    console.log("📦 FULL PRODUCT RECEIVED:", product);

    this.renderProductDetails(product);

    document.querySelector(".add-to-cart").addEventListener("click", () => {
      saveToCart(product);
      alert("Product added to cart!");
    });
  }

  renderProductDetails(product) {
    if (!product) {
      this.element.innerHTML = "<p>Error loading product details.</p>";
      return;
    }

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







