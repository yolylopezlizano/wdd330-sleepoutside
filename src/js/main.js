// main.js
import ProductData from "./ProductData.mjs";

console.log(" main.js loaded successfully");

const dataSource = new ProductData("tents");

async function renderProductList() {
  const products = await dataSource.getData();
  console.log("Products loaded:", products);

  const listElement = document.querySelector(".product-list");

  if (!listElement) {
    console.log("The .product-list element was not found in the HTML");
    return;
  }

  const validProducts = products.filter(
    (product) =>
      product.Image &&
      product.Image.trim() !== "" &&
      !product.Image.includes("undefined") &&
      !product.Image.includes("missing")
  );

  const html = validProducts
    .map((product) => {
      const imageSrc = product.Image ? product.Image.replace("../", "/") : "/images/no-image.png";
      return `
      <li class="product-card">
        <a href="/product_pages/index.html?product=${product.Id}">
          <img src="${imageSrc}" alt="${product.Name}" onerror="this.parentElement.parentElement.remove();" />
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
