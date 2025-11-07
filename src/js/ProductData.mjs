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

    // 🌍 rutas por entorno
    if (window.location.hostname.includes("github.io")) {
      // GitHub Pages (repositorio <user>.github.io/wdd330-sleepoutside)
      basePath = "/wdd330-sleepoutside/json/";
    } else if (window.location.hostname.includes("netlify.app")) {
      // Netlify: el plugin copió json a /json
      basePath = "/json/";
    } else {
      // local dev (vite: /src es raíz de dev server, pero fetch relativo funciona con ../json/)
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







