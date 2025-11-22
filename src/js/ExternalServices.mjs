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

    // Always send through convertToJson
    return convertToJson(response);
  }
}


