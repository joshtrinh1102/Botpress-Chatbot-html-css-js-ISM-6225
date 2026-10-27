/* StockWise inventory dashboard. Uses the group's 120-row product snapshot. */
(() => {
  'use strict';
  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
  const integer = n => new Intl.NumberFormat('en-US').format(n);
  const number = x => Number(x) || 0;
  const byId = id => document.getElementById(id);
  const colors = ['#1f4fd8','#10b981','#f59e0b','#8b5cf6','#06b6d4','#ec4899','#64748b','#fb7185','#84cc16','#0ea5e9','#a855f7','#f97316'];
  const charts = {};

  function group(rows, key, measure) {
    const counts = new Map();
    rows.forEach(row => counts.set(row[key], (counts.get(row[key]) || 0) + measure(row)));
    return [...counts].sort((a,b) => b[1]-a[1]);
  }

  function render(rows) {
    const sumValue = rows.reduce((acc,r) => acc + number(r.InventoryValueUSD), 0);
    byId('kpiInventoryValue').textContent = money(sumValue);
    byId('kpiTotalProducts').textContent = integer(rows.length);
    byId('kpiLowStock').textContent = integer(rows.filter(r => r.StockStatus === 'Reorder Needed').length);
    byId('kpiRestock').textContent = integer(rows.filter(r => r.RestockRecommended.trim().toLowerCase() === 'yes').length);

    const values = group(rows,'Category',r => number(r.InventoryValueUSD));
    const statusNames = ['In Stock','Reorder Needed','Out of Stock'];
    const statuses = statusNames.map(name => rows.filter(r => r.StockStatus === name).length);
    const restock = group(rows.filter(r => r.RestockRecommended.toLowerCase() === 'yes'),'Category',() => 1);
    const top = [...rows].sort((a,b)=>number(b.InventoryValueUSD)-number(a.InventoryValueUSD)).slice(0,5);

    draw('inventoryValueChart','bar',values.map(x=>x[0]),[{label:'Inventory value',data:values.map(x=>x[1]),backgroundColor:colors[0]}],true,true);
    draw('stockStatusChart','doughnut',statusNames,[{label:'Products',data:statuses,backgroundColor:['#10b981','#f59e0b','#ef4444']}],false,false);
    draw('restockChart','bar',restock.map(x=>x[0]),[{label:'Products flagged for restocking',data:restock.map(x=>x[1]),backgroundColor:colors[2]}],false,true);
    draw('topProductsChart','bar',top.map(r=>r.ProductName),[{label:'Inventory value',data:top.map(r=>number(r.InventoryValueUSD)),backgroundColor:colors[1]}],true,false,true);
  }

  function draw(id,type,labels,datasets,currency,categoryAxis,horizontal=false) {
    if (charts[id]) charts[id].destroy();
    const options = {
      responsive:true,maintainAspectRatio:false,
      indexAxis: horizontal ? 'y' : 'x',
      plugins:{
        legend:{display:type==='doughnut'},
        tooltip:{callbacks:{label: context => `${context.label || context.dataset.label}: ${currency ? money(context.parsed[horizontal ? 'x' : 'y']) : integer(type==='doughnut' ? context.parsed : context.parsed[horizontal ? 'x' : 'y'])}`}}
      }
    };
    if(type==='bar') {
      const axis = horizontal ? 'x' : 'y';
      options.scales = {
        [axis]: {beginAtZero:true,ticks:{callback:v=> currency ? '$'+integer(v) : integer(v)}},
        [horizontal?'y':'x']: {ticks:{autoSkip:false,maxRotation:categoryAxis?55:0,minRotation:0}}
      };
    }
    charts[id]=new Chart(byId(id),{type,data:{labels,datasets},options});
  }

  function initialize() {
    const rows = window.STOCKWISE_PRODUCTS;
    if (!Array.isArray(rows) || !rows.length || typeof Chart === 'undefined') {
      const msg=byId('dashboardError'); msg.hidden=false;
      msg.textContent='Dashboard data or Chart.js could not load. Check your script paths and internet connection.';
      return;
    }
    const dropdown=byId('categorySelect');
    [...new Set(rows.map(r=>r.Category))].sort().forEach(category => {
      const option=document.createElement('option'); option.value=category; option.textContent=category;
      dropdown.appendChild(option);
    });
    const refresh=()=>render(dropdown.value==='all'?rows:rows.filter(r=>r.Category===dropdown.value));
    dropdown.addEventListener('change',refresh);
    byId('resetFilter').addEventListener('click',()=>{dropdown.value='all';refresh();});
    refresh();
  }
  document.addEventListener('DOMContentLoaded', initialize);
})();
