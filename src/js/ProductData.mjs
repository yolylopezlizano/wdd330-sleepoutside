function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;

    // Detect environment and set correct base path
    let basePath;

    if (window.location.hostname.includes("github.io")) {
      // For GitHub Pages
      basePath = "/wdd330-sleepoutside/src/json/";
    } else if (window.location.hostname.includes("netlify.app")) {
      // ✅ For Netlify builds
      basePath = "/json/";
    } else {
      // Local development
      basePath = "../json/";
    }

    this.path = `${basePath}${this.category}.json`;
    console.log("📦 ProductData loading from:", this.path);
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}




