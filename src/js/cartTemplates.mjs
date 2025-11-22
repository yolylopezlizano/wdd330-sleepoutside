export function cartItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    "/images/no-image.png";

  const qty = item.quantity || 1;  
  const total = (item.FinalPrice * qty).toFixed(2);

  return `
    <li class="cart-card divider">
      <button class="remove-btn" data-id="${item.Id}">✖</button>

      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" />
      </a>

      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">Qty: ${qty}</p>
      <p class="cart-card__price">$${total}</p>
    </li>
  `;
}


