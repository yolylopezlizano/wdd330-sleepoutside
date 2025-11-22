//SELECTORS
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

//LOCAL STORAGE
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

//CLICKS
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;

  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  element.addEventListener("click", callback);
}

//URL PARAM
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

//TEMPLATE RENDERING
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) parentElement.innerHTML = "";
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    console.error("Parent element not found for template rendering");
    return;
  }

  parentElement.innerHTML = template;
  if (callback) callback(data);
}

//JSON CONVERTER
export async function convertToJson(res) {
  // Always extract JSON body first
  let jsonResponse;
  try {
    jsonResponse = await res.json();
  } catch (e) {
    jsonResponse = { message: "Invalid JSON response from server" };
  }

  // If OK → return data
  if (res.ok) {
    return jsonResponse;
  }

  // If NOT OK → return detailed server error
  throw {
    name: "servicesError",
    message: jsonResponse
  };
}


// ======= FORM DATA TO JSON =======
export function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

//CART ITEM COUNT
export function getCartItemCount() {
  const cart = getLocalStorage("so-cart") || [];
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

//UPDATE CART COUNTER IN HEADER
export function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.textContent = getCartItemCount();
  }
}

//SAVE TO CART 
export function saveToCart(product) {
  let cart = getLocalStorage("so-cart") || [];

  // ⭐ Clon profundo para evitar referencias
  const item = JSON.parse(JSON.stringify(product));

  const existing = cart.find((p) => p.Id === item.Id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }

  setLocalStorage("so-cart", cart);
  alertMessage("Item added to cart!", false);
  
  animateCartIcon();

}

export function animateCartIcon() {
  const cartIcon = document.querySelector(".cart");

  if (!cartIcon) return;

  // add class
  cartIcon.classList.add("animate");

  // remove after animation ends
  setTimeout(() => {
    cartIcon.classList.remove("animate");
  }, 500);
}

// LOAD PARTIALS (WITH CART COUNTER UPDATE)
export async function loadTemplate(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load template: ${path}`);
    return await response.text();
  } catch (err) {
    console.error("❌ Error loading template:", err);
    return "<p>Error loading template.</p>";
  }
}

export async function loadHeaderFooter() {
  try {
    const headerHTML = await loadTemplate("/partials/header.html");
    const footerHTML = await loadTemplate("/partials/footer.html");

    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");

    if (headerElement) {
      renderWithTemplate(headerHTML, headerElement);

      // ⭐ Update cart counter
      const countElement = document.getElementById("cart-count");
      if (countElement) {
        countElement.textContent = getCartItemCount();
      }
    }

    if (footerElement) {
      renderWithTemplate(footerHTML, footerElement);
    }

    console.log("✅ Header and footer loaded");

  } catch (err) {
    console.error("❌ Error loading header/footer:", err);
  }
}

export function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;

  document.body.appendChild(toast);

  // Show
  setTimeout(() => {
    toast.classList.add("toast-show");
  }, 10);

  // Hide after 3s
  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 200);
  }, 1500);
}

// ======= CUSTOM ALERT MESSAGE =======

export function alertMessage(message, scroll = true) {
  // create element
  const alert = document.createElement("div");
  alert.classList.add("alert-success-box");

  // message + close button (X)
  alert.innerHTML = `
    <p>${message}</p>
    <button class="alert-close">X</button>
  `;

  // remove alert when X is clicked
  alert.addEventListener("click", (e) => {
    if (e.target.classList.contains("alert-close")) {
      alert.remove();
    }
  });

  // insert alert at top of main
  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  // scroll to top if needed
  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function alertSuccess(message, scroll = false) {
  const alert = document.createElement("div");
  alert.classList.add("alert-success");

  alert.innerHTML = `
    <p>${message}</p>
    <button class="alert-close">X</button>
  `;

  alert.addEventListener("click", (e) => {
    if (e.target.classList.contains("alert-close")) {
      alert.remove();
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);
}


