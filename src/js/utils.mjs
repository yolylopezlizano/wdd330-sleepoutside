// ======= SELECTORS =======
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// ======= LOCAL STORAGE =======
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ======= CLICKS =======
export function setClick(selector, callback) {
  const element = qs(selector);
  if (!element) return;

  element.addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  element.addEventListener("click", callback);
}

// ======= URL PARAM =======
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// ======= TEMPLATE RENDERING =======
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

// ======= JSON CONVERTER =======
export function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// ======= CART ITEM COUNT =======
export function getCartItemCount() {
  const cart = getLocalStorage("so-cart") || [];
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

// ======= UPDATE CART COUNTER IN HEADER =======
export function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (countElement) {
    countElement.textContent = getCartItemCount();
  }
}

// ======= SAVE TO CART =======
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
}

// ======= LOAD PARTIALS (WITH CART COUNTER UPDATE) =======
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





