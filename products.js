
async function loadProducts() {
  const tableBody = document.getElementById("productTableBody");

  try {
    const response = await fetch("data/products.csv");

    if (!response.ok) {
      throw new Error("Unable to load product data.");
    }

    const csvText = await response.text();

    // Papa Parse handles quoted fields and commas inside descriptions.
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    tableBody.innerHTML = "";

    result.data.forEach(product => {
      const row = document.createElement("tr");

      const values = [
        product.Product_ID,
        product.Product_Name,
        product.Category,
        product.Brand,
        Number(product.Price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        }),
        product.Stock_Status
      ];

      values.forEach(value => {
        const cell = document.createElement("td");
        cell.textContent = value ?? "";
        row.appendChild(cell);
      });

      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error(error);
    tableBody.innerHTML =
      '<tr><td colspan="6">Unable to load inventory.</td></tr>';
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
