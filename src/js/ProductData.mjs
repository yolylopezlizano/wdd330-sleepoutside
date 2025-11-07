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
    let basePath;

    if (window.location.hostname.includes("github.io")) {
      basePath = "/wdd330-sleepoutside/json/";
    } else if (window.location.hostname.includes("netlify.app")) {
      basePath = "/json/";
    } else {
      basePath = "../json/";
    }

    this.path = `${basePath}${this.category}.json`;
    console.log("📦 ProductData loading from:", this.path);
  }

  getData() {
    return fetch(this.path).then(convertToJson).then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}







