import { convertToJson } from "./utils.mjs";

export default class ProductData {
  constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL;
    console.log("🔍 VITE_SERVER_URL:", this.baseURL);
  }

  async getData(category) {
    const response = await fetch(`${this.baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${this.baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log("🔍 API returned (raw):", data);
    return data.Result; // ⭐ IMPORTANT: we return ONLY the product object
  }
}

