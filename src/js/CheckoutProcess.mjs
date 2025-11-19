// CheckoutProcess.mjs
import { getLocalStorage, formDataToJSON } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  // Calculates and displays subtotal and item count
  calculateItemSubTotal() {
    if (!this.list.length) return;

    // subtotal of items
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + item.FinalPrice * (item.quantity || 1),
      0
    );

    const summary = document.querySelector(this.outputSelector);
    if (!summary) return;

    const subtotalElem = summary.querySelector("#subtotal");
    const itemCountElem = summary.querySelector("#item-count");

    if (subtotalElem) {
      subtotalElem.textContent = this.itemTotal.toFixed(2);
    }

    const itemCount = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    if (itemCountElem) {
      itemCountElem.textContent = `${itemCount} item${
        itemCount !== 1 ? "s" : ""
      }`;
    }
  }

  // Calculates tax, shipping and orderTotal
  calculateOrderTotal() {
    if (!this.list.length) return;

    // 6% tax
    this.tax = this.itemTotal * 0.06;

    // Shipping: $10 for first item + $2 for each additional
    const totalItems = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    this.shipping = totalItems > 0 ? 10 + (totalItems - 1) * 2 : 0;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  // Displays tax, shipping and total in the summary panel
  displayOrderTotals() {
    const summary = document.querySelector(this.outputSelector);
    if (!summary) return;

    const taxElem = summary.querySelector("#tax");
    const shippingElem = summary.querySelector("#shipping");
    const orderTotalElem = summary.querySelector("#orderTotal");

    if (taxElem) taxElem.textContent = this.tax.toFixed(2);
    if (shippingElem) shippingElem.textContent = this.shipping.toFixed(2);
    if (orderTotalElem) orderTotalElem.textContent = this.orderTotal.toFixed(2);
  }

  // Converts cart items to the simple format the server expects
  packageItems(items) {
    if (!items || !items.length) return [];

    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.quantity || 1,
    }));
  }

  async checkout(form) {
    // convert form to JSON object
    const order = formDataToJSON(form);

    // required extra fields
    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);
    console.log("📦 ORDER ABOUT TO BE SENT:", order);

    try {
    // send to server
      const result = await this.services.checkout(order);
      console.log("Server response:", result);
      return result;
    } catch (err) {
      console.error("Checkout error:", err);
      throw new Error("Unable to submit order");
    }
  }
}


