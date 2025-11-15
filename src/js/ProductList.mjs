// ProductList.mjs

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    console.log("📦 ProductList.init category:", this.category);

    const list = await this.dataSource.getData(this.category);

    console.log("📦 Products from API:", list);

    this.renderList(list);
  }

  renderList(products) {
    if (!this.listElement) {
      console.error("❌ No se encontró .product-list en el HTML");
      return;
    }

    const html = products
      .map((product) => {

        // ⭐ Usar imágenes del API tal como vienen
        const imageSrc =
          product.Images?.PrimaryLarge ||
          product.Images?.PrimaryMedium ||
          product.Images?.PrimarySmall ||
          "/images/no-image.png";

        return `
        <li class="product-card">

          <!-- ⭐ MUY IMPORTANTE: ruta RELATIVA correcta -->
          <a href="../product_pages/index.html?product=${product.Id}">
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
