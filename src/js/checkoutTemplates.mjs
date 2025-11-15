// checkoutTemplates.mjs
export function checkoutItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    "/images/no-image.png";

  return `
    <li class="cart-card divider">

      <div class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" />
      </div>

      <h2 class="card__name">${item.Name}</h2>

      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
      <p class="cart-card__quantity">Qty: ${item.quantity}</p>
      <p class="cart-card__price">$${(item.FinalPrice * item.quantity).toFixed(2)}</p>
    </li>
  `;
}
