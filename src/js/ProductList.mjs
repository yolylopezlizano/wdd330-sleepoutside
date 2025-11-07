import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageSrc =
    product.Image &&
    typeof product.Image === "string" &&
    product.Image.trim() !== "" &&
    !product.Image.toLowerCase().includes("undefined") &&
    !product.Image.toLowerCase().includes("missing")
      ? product.Image.replace("../", "/")
      : "../images/no-image.png";

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img 
          src="${imageSrc}" 
          alt="${product.Name}" 
          onerror="this.src='/images/no-image.png'; this.onerror=null;" 
        />
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const products = await this.dataSource.getData();
      this.renderList(products);
    } catch (err) {
      console.error("❌ Error loading product list:", err);
      this.listElement.innerHTML = "<p>Failed to load products.</p>";
    }
  }

  renderList(products) {
    if (!products || products.length === 0) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }

    const validProducts = products.filter(
      (p) =>
        p.Image &&
        typeof p.Image === "string" &&
        p.Image.trim() !== "" &&
        !p.Image.toLowerCase().includes("undefined") &&
        !p.Image.toLowerCase().includes("missing")
    );

    renderListWithTemplate(productCardTemplate, this.listElement, validProducts);
  }
}


