// main.js
import ProductData from "./ProductData.mjs";

console.log("✅ main.js loaded successfully");

const dataSource = new ProductData("tents");

async function renderProductList() {
  const products = await dataSource.getData();
  console.log("📦 Products loaded:", products);

  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    console.log("❌ .product-list element not found in HTML");
    return;
  }

  const html = products
    .map((product) => {
      // 🖼️ Use product image or fallback placeholder
      const imageSrc =
        product.Image && product.Image.trim() !== ""
          ? product.Image.replace("../", "/")
          : "../images/no-image.png"; // <- use the English file name

      return `
      <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${imageSrc}" alt="${product.Name}" />
          <h3>${product.Brand.Name}</h3>
          <h2>${product.NameWithoutBrand}</h2>
          <p>$${product.FinalPrice}</p>
        </a>
      </li>`;
    })
    .join("");

  listElement.innerHTML = html;
}

renderProductList();


