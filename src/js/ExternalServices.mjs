import { convertToJson } from "./utils.mjs";

const baseURL = import.meta.env.VITE_SERVER_URL;

export default class ExternalServices {
  
  constructor() {
    this.baseURL = baseURL;
  }

  // Get product list by category
  async getProducts(category) {
    const response = await fetch(`${this.baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Get product by ID
  async findProductById(id) {
    const response = await fetch(`${this.baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Send checkout order
  async checkout(orderData) {
    const url = `${this.baseURL}checkout`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    };

    const response = await fetch(url, options);

      // If error (400), read body as JSON and extract message
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (errorData) {
        // The backend sends { "cardNumber": "Invalid Card Number" }
        const firstKey = Object.keys(errorData)[0];
        throw new Error(errorData[firstKey]);
      }

      throw new Error("Unknown checkout error");
    }

  return convertToJson(response);
}


}
