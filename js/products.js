(function () {
  const STORAGE_KEY = "stockwise_inventory";

  function readSharedInventory() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.warn("Unable to read shared inventory:", error);
      return [];
    }
  }

  function normalizeProduct(product) {
    const id = product.id || product.ProductID || product.productId || "";
    const name = product.name || product.ProductName || product.productName || "";
    const category = product.category || product.Category || product.productCategory || "";
    const price = Number(product.price ?? product.UnitPriceUSD ?? product.unitPrice ?? 0);
    const stock = Number(product.stock ?? product.QuantityInStock ?? product.quantityInStock ?? 0);
    const status = product.status || product.StockStatus || "";
    const location = product.location || product.ProductLocation || "";

    return {
      id,
      name,
      category,
      price,
      stock,
      status,
      location
    };
  }

  function renderProducts(tableBody, products) {
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");
      const values = [
        product.id,
        product.name,
        product.category,
        product.ProductType || "General",
        Number(product.price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        }),
        product.stock,
        product.status || "In Stock",
        product.location || "N/A"
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value ?? "";
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });
  }

  async function loadProducts() {
    const tableBody = document.getElementById("productTableBody");

    if (!tableBody) return;

    const savedInventory = readSharedInventory();
    if (savedInventory.length) {
      renderProducts(tableBody, savedInventory.map(normalizeProduct));
      window.STOCKWISE_PRODUCTS = savedInventory.map(normalizeProduct);
      return;
    }

    try {
      const response = await fetch("data/Products.csv.csv");

      if (!response.ok) {
        throw new Error("Unable to load product data.");
      }

      const csvText = await response.text();
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      if (result.errors.length) {
        console.warn("CSV parsing warnings:", result.errors);
      }

      const normalized = result.data.map((product) => normalizeProduct(product));
      renderProducts(tableBody, normalized);
      window.STOCKWISE_PRODUCTS = normalized;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (error) {
        console.warn("Unable to cache shared inventory:", error);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      tableBody.innerHTML =
        '<tr><td colspan="8">Unable to load inventory.</td></tr>';
    }
  }

  document.addEventListener("DOMContentLoaded", loadProducts);
})();
