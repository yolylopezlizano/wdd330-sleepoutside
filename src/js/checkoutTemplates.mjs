export function checkoutItemTemplate(item) {
  const imageSrc =
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    "/images/no-image.png";

  const quantity = item.quantity || 1;

  return `
    <li class="cart-card divider">
      <div class="cart-card__image">
        <img src="${imageSrc}" alt="${item.Name}" />
      </div>

      <h2 class="card__name">${item.Name}</h2>

      <p class="cart-card__quantity">Qty: ${quantity}</p>
      <p class="cart-card__price">
        $${(item.FinalPrice * quantity).toFixed(2)}
      </p>
    </li>
  `;
}

