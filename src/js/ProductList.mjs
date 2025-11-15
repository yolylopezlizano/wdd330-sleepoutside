// ProductList.mjs

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData();

    // Filtrar solo productos con imágenes válidas
    const validProducts = products.filter(
      (product) =>
        product.Image &&
        product.Image.trim() !== "" &&
        !product.Image.includes("undefined") &&
        !product.Image.includes("missing")
    );

    this.renderList(validProducts);
  }

  renderList(products) {
    if (!this.listElement) {
      console.error("❌ No se encontró .product-list en el HTML");
      return;
    }

    const html = products
      .map((product) => {
        const imageSrc = product.Image
          ? product.Image.replace("../", "/")
          : "/images/no-image.png";

        return `
        <li class="product-card">
          <a href="/product_pages/index.html?product=${product.Id}">
            <img src="${imageSrc}" alt="${product.Name}" />
            <h3>${product.Name}</h3>
            <p>$${product.FinalPrice}</p>
          </a>
        </li>`;
      })
      .join("");

    this.listElement.innerHTML = html;
  }
}


