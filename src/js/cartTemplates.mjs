// cartTemplates.mjs
export function cartItemTemplate(item) {
  const imageSrc =
    item.Image && typeof item.Image === "string"
      ? item.Image.replace("../", "/")
      : "/images/no-image.png";

  return `
    <li class="cart-card divider">
      <button class="remove-btn" data-id="${item.Id}">✖</button>

      <a href="#" class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" onerror="this.src='/images/no-image.png'; this.onerror=null;" />
      </a>

      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>

      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">Qty: ${item.quantity || 1}</p>
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
    </li>
  `;
}
