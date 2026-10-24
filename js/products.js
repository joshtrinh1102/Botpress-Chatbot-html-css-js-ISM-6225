
async function loadProducts() {
  const tableBody = document.getElementById("productTableBody");

  if (!tableBody) return;

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

    tableBody.innerHTML = "";

    result.data.forEach(product => {
      const row = document.createElement("tr");

      const values = [
        product.ProductID,
        product.ProductName,
        product.Category,
        product.ProductType,
        Number(product.UnitPriceUSD).toLocaleString(
          "en-US", {
            style: "currency",
            currency: "USD"
          }
        ),
        product.QuantityInStock,
        product.StockStatus,
        product.ProductLocation
      ];

      values.forEach(value => {
        const cell = document.createElement("td");

        cell.textContent = value ?? "";

        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error loading products:", error);

    tableBody.innerHTML =
      '<tr><td colspan="8">Unable to load inventory.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
