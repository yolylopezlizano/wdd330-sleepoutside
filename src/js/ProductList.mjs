import ProductData from "./ProductData.mjs";

export default class ProductList {
  constructor(category, listElementSelector) {
    this.category = category;
    this.dataSource = new ProductData(this.category);
    this.listElement = document.querySelector(listElementSelector);
  }

  async init() {
    try {
      const products = await this.dataSource.getData();

      this.renderList(products);
    } catch (err) {
      console.error("Error loading product list:", err);
      this.listElement.innerHTML = "<p>Failed to load products.</p>";
    }
  }

  renderList(products) {
    if (!products || products.length === 0) {
      this.listElement.innerHTML = "<p>No products found.</p>";
      return;
    }

    const html = products
      .map((product) => this.productCardTemplate(product))
      .join("");

    this.listElement.innerHTML = html;
  }

  productCardTemplate(product) {
    return `
      <li class="product-card">
        <a href="product_pages/index.html?product=${product.Id}">
          <img src="${product.Image}" alt="${product.Name}" />
          <h2 class="card__name">${product.NameWithoutBrand}</h2>
          <p class="card__brand">${product.Brand.Name}</p>
          <p class="card__price">$${product.FinalPrice}</p>
        </a>
      </li>
    `;
  }
}
