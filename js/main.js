/* =========================================================
   StockWise - main.js
   Shared site behavior, dashboard charts, and CRUD mockup.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initFooterYear();

  if (document.getElementById("revenueChart")) {
    initDashboard();
  }

  if (document.getElementById("productForm")) {
    initCrud();
  }
});

/* ---------- Navigation ---------- */
function initNavigation() {
  // Highlight the link for the current page
  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  // Mobile menu toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });
  }
}

function initFooterYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/* ---------- Dashboard (Chart.js) ---------- */
var salesData = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  revenue: {
    2025: [182000, 165000, 194000, 201000, 215000, 232000, 228000, 246000, 239000, 258000, 312000, 368000],
    2026: [205000, 188000, 221000, 230000, 244000, 261000, 257000, 279000, 270000, 291000, 338000, 402000]
  },
  categories: {
    labels: ["Laptops", "Smartphones", "Audio", "Gaming", "Smart Home", "Accessories"],
    2025: [912000, 784000, 341000, 456000, 228000, 119000],
    2026: [1010000, 862000, 388000, 512000, 274000, 140000]
  },
  stores: {
    labels: ["Tampa", "Orlando", "Miami", "Jacksonville"],
    online: [540000, 410000, 465000, 290000],
    inStore: [620000, 480000, 530000, 310000]
  },
  topProducts: {
    labels: ["VoltBook Pro 14", "Nova X5 Phone", "PulseBuds ANC", "Arcade One Console", "HomeHub Mini"],
    units: [1240, 1785, 2630, 960, 1420]
  }
};

var charts = {};

function initDashboard() {
  if (typeof Chart === "undefined") {
    console.error("Chart.js failed to load.");
    return;
  }

  Chart.defaults.font.family = '"Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  Chart.defaults.color = "#4b5563";

  var palette = ["#1f4fd8", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
  var yearSelect = document.getElementById("yearSelect");
  var year = yearSelect.value;

  // 1. Monthly revenue line chart
  charts.revenue = new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: salesData.months,
      datasets: [{
        label: "Revenue " + year,
        data: salesData.revenue[year],
        borderColor: palette[0],
        backgroundColor: "rgba(31, 79, 216, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (ctx) { return ctx.dataset.label + ": " + formatCurrency(ctx.parsed.y); }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function (v) { return "$" + v / 1000 + "k"; } }
        }
      }
    }
  });

  // 2. Sales by category doughnut chart
  charts.category = new Chart(document.getElementById("categoryChart"), {
    type: "doughnut",
    data: {
      labels: salesData.categories.labels,
      datasets: [{
        data: salesData.categories[year],
        backgroundColor: palette,
        borderWidth: 2,
        hoverOffset: 12
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
              var pct = ((ctx.parsed / total) * 100).toFixed(1);
              return ctx.label + ": " + formatCurrency(ctx.parsed) + " (" + pct + "%)";
            }
          }
        }
      }
    }
  });

  // 3. Revenue by store and channel (stacked bar)
  charts.store = new Chart(document.getElementById("storeChart"), {
    type: "bar",
    data: {
      labels: salesData.stores.labels,
      datasets: [
        { label: "In-Store", data: salesData.stores.inStore, backgroundColor: palette[0], borderRadius: 6 },
        { label: "Online", data: salesData.stores.online, backgroundColor: palette[1], borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (ctx) { return ctx.dataset.label + ": " + formatCurrency(ctx.parsed.y); }
          }
        }
      },
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          ticks: { callback: function (v) { return "$" + v / 1000 + "k"; } }
        }
      }
    }
  });

  // 4. Top products by units sold (horizontal bar)
  charts.products = new Chart(document.getElementById("productsChart"), {
    type: "bar",
    data: {
      labels: salesData.topProducts.labels,
      datasets: [{
        label: "Units Sold",
        data: salesData.topProducts.units,
        backgroundColor: palette.slice(0, 5),
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  yearSelect.addEventListener("change", function () {
    updateDashboardYear(yearSelect.value);
  });

  document.getElementById("chartTypeToggle").addEventListener("click", toggleRevenueChartType);

  updateKpis(year);
}

function updateDashboardYear(year) {
  charts.revenue.data.datasets[0].data = salesData.revenue[year];
  charts.revenue.data.datasets[0].label = "Revenue " + year;
  charts.revenue.update();

  charts.category.data.datasets[0].data = salesData.categories[year];
  charts.category.update();

  updateKpis(year);
}

function toggleRevenueChartType() {
  var chart = charts.revenue;
  var isLine = chart.config.type === "line";
  chart.config.type = isLine ? "bar" : "line";
  chart.data.datasets[0].borderRadius = isLine ? 6 : 0;
  chart.data.datasets[0].backgroundColor = isLine ? "#1f4fd8" : "rgba(31, 79, 216, 0.12)";
  chart.update();
  document.getElementById("chartTypeToggle").textContent = isLine ? "Show as Line" : "Show as Bar";
}

function updateKpis(year) {
  var sum = function (arr) { return arr.reduce(function (a, b) { return a + b; }, 0); };
  var revenue = sum(salesData.revenue[year]);
  var previous = salesData.revenue[year - 1] ? sum(salesData.revenue[year - 1]) : null;
  var orders = Math.round(revenue / 412);

  document.getElementById("kpiRevenue").textContent = formatCurrency(revenue).replace(".00", "");
  document.getElementById("kpiOrders").textContent = orders.toLocaleString();
  document.getElementById("kpiAov").textContent = formatCurrency(revenue / orders);

  var changeEl = document.getElementById("kpiRevenueChange");
  if (previous) {
    var change = ((revenue - previous) / previous) * 100;
    changeEl.textContent = (change >= 0 ? "▲ " : "▼ ") + Math.abs(change).toFixed(1) + "% vs " + (year - 1);
    changeEl.className = "kpi-change " + (change >= 0 ? "up" : "down");
  } else {
    changeEl.textContent = "First year of data";
    changeEl.className = "kpi-change";
  }
}

/* ---------- CRUD Mockup (in-memory, no database) ---------- */
var seedProducts = [
  { id: "VE-1001", name: "VoltBook Pro 14", category: "Laptops", price: 1299.99, stock: 24 },
  { id: "VE-1002", name: "VoltBook Air 13", category: "Laptops", price: 899.99, stock: 31 },
  { id: "VE-1003", name: "Nova X5 Phone", category: "Smartphones", price: 999.0, stock: 42 },
  { id: "VE-1004", name: "Nova Lite Phone", category: "Smartphones", price: 449.0, stock: 6 },
  { id: "VE-1005", name: "PulseBuds ANC", category: "Audio", price: 179.99, stock: 88 },
  { id: "VE-1006", name: "BoomBox 360 Speaker", category: "Audio", price: 129.99, stock: 0 },
  { id: "VE-1007", name: "Arcade One Console", category: "Gaming", price: 499.99, stock: 12 },
  { id: "VE-1008", name: "HomeHub Mini", category: "Smart Home", price: 59.99, stock: 64 }
];

var products = [];
var nextIdNumber = 1009;

function getInventoryStorageKey() {
  return "stockwise_inventory";
}

function readSharedInventory() {
  try {
    var saved = JSON.parse(localStorage.getItem(getInventoryStorageKey()) || "null");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Unable to read shared inventory:", error);
    return [];
  }
}

function writeSharedInventory(list) {
  try {
    localStorage.setItem(getInventoryStorageKey(), JSON.stringify(list));
    window.STOCKWISE_PRODUCTS = list.map(function (item) {
      return Object.assign({}, item);
    });
  } catch (error) {
    console.warn("Unable to save shared inventory:", error);
  }
}

function nextProductIdFromProducts(productList) {
  var maxId = 1008;

  productList.forEach(function (product) {
    var match = String(product.id || "").match(/(\d+)$/);
    if (match) {
      var numericId = parseInt(match[1], 10);
      if (!isNaN(numericId)) {
        maxId = Math.max(maxId, numericId);
      }
    }
  });

  return maxId + 1;
}

function initCrud() {
  var form = document.getElementById("productForm");
  var searchInput = document.getElementById("searchInput");
  var categoryFilter = document.getElementById("categoryFilter");

  resetData();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    saveProduct();
  });

  document.getElementById("cancelEdit").addEventListener("click", clearForm);
  document.getElementById("resetData").addEventListener("click", function () {
    if (confirm("Reset the inventory back to the sample data?")) {
      resetData();
      showToast("Inventory reset to sample data.");
    }
  });

  searchInput.addEventListener("input", renderTable);
  categoryFilter.addEventListener("change", renderTable);

  // Edit / delete buttons are rendered dynamically, so use event delegation
  document.getElementById("productTableBody").addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-action]");
    if (!btn) return;
    var id = btn.getAttribute("data-id");
    if (btn.getAttribute("data-action") === "edit") {
      editProduct(id);
    } else if (btn.getAttribute("data-action") === "delete") {
      deleteProduct(id);
    }
  });
}

function resetData() {
  var savedInventory = readSharedInventory();

  if (savedInventory.length) {
    products = savedInventory.map(function (p) { return Object.assign({}, p); });
  } else {
    products = seedProducts.map(function (p) { return Object.assign({}, p); });
    writeSharedInventory(products);
  }

  nextIdNumber = nextProductIdFromProducts(products);
  clearForm();
  renderTable();
}

// CREATE + UPDATE
function saveProduct() {
  var editingId = document.getElementById("productId").value;
  var product = {
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    price: parseFloat(document.getElementById("productPrice").value),
    stock: parseInt(document.getElementById("productStock").value, 10)
  };

  if (!product.name || !product.category || isNaN(product.price) || isNaN(product.stock)) {
    showToast("Please fill in every field.");
    return;
  }
  if (product.price < 0 || product.stock < 0) {
    showToast("Price and stock cannot be negative.");
    return;
  }

  if (editingId) {
    var existing = products.find(function (p) { return p.id === editingId; });
    Object.assign(existing, product);
    showToast("Updated " + product.name + ".");
  } else {
    product.id = "VE-" + nextIdNumber++;
    products.push(product);
    showToast("Added " + product.name + " to inventory.");
  }

  writeSharedInventory(products);
  clearForm();
  renderTable();
}

// READ
function renderTable() {
  var tbody = document.getElementById("productTableBody");
  var search = document.getElementById("searchInput").value.trim().toLowerCase();
  var category = document.getElementById("categoryFilter").value;

  var filtered = products.filter(function (p) {
    var matchesSearch = !search || p.name.toLowerCase().indexOf(search) !== -1 || p.id.toLowerCase().indexOf(search) !== -1;
    var matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No products found.</td></tr>';
  } else {
    tbody.innerHTML = filtered.map(function (p) {
      return "<tr>" +
        "<td>" + escapeHtml(p.id) + "</td>" +
        "<td>" + escapeHtml(p.name) + "</td>" +
        "<td>" + escapeHtml(p.category) + "</td>" +
        "<td>" + formatCurrency(p.price) + "</td>" +
        "<td>" + p.stock + "</td>" +
        "<td>" + stockBadge(p.stock) + "</td>" +
        '<td class="actions">' +
          '<button class="btn btn-secondary btn-sm" data-action="edit" data-id="' + p.id + '">Edit</button>' +
          '<button class="btn btn-danger btn-sm" data-action="delete" data-id="' + p.id + '">Delete</button>' +
        "</td>" +
      "</tr>";
    }).join("");
  }

  var totalValue = products.reduce(function (sum, p) { return sum + p.price * p.stock; }, 0);
  document.getElementById("productCount").textContent = products.length;
  document.getElementById("inventoryValue").textContent = formatCurrency(totalValue);
  document.getElementById("lowStockCount").textContent = products.filter(function (p) { return p.stock < 10; }).length;
  writeSharedInventory(products);
}

function editProduct(id) {
  var p = products.find(function (item) { return item.id === id; });
  if (!p) return;

  document.getElementById("productId").value = p.id;
  document.getElementById("productName").value = p.name;
  document.getElementById("productCategory").value = p.category;
  document.getElementById("productPrice").value = p.price;
  document.getElementById("productStock").value = p.stock;

  document.getElementById("formTitle").innerHTML = 'Edit Product <span class="mode-badge edit">Editing ' + p.id + "</span>";
  document.getElementById("submitBtn").textContent = "Update Product";
  document.getElementById("cancelEdit").hidden = false;
  document.getElementById("productForm").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("productName").focus();
}

// DELETE
function deleteProduct(id) {
  var p = products.find(function (item) { return item.id === id; });
  if (!p || !confirm('Delete "' + p.name + '" from inventory?')) return;

  products = products.filter(function (item) { return item.id !== id; });
  if (document.getElementById("productId").value === id) {
    clearForm();
  }
  writeSharedInventory(products);
  renderTable();
  showToast("Deleted " + p.name + ".");
}

function clearForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("formTitle").innerHTML = 'Add Product <span class="mode-badge">New</span>';
  document.getElementById("submitBtn").textContent = "Add Product";
  document.getElementById("cancelEdit").hidden = true;
}

function stockBadge(stock) {
  if (stock === 0) return '<span class="stock-badge stock-out">Out of Stock</span>';
  if (stock < 10) return '<span class="stock-badge stock-low">Low Stock</span>';
  return '<span class="stock-badge stock-ok">In Stock</span>';
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
