// import { createBarChart, createLineChart, createPieChart } from "./amchartsHelper.js";

// am5.ready(function() {
//   let currentChartRoot = null;
//   const chartSelect = document.getElementById("chartSelect");

//   function loadChart(type) {
//     fetch(`./chartSamples/${type}Chart.json`)
//       .then(res => res.json())
//       .then(data => {
//         if(currentChartRoot) currentChartRoot.dispose();
//         const root = am5.Root.new("chartdiv");
//         root.setThemes([am5themes_Animated.new(root)]);
//         currentChartRoot = root;

//         switch(type) {
//           case "bar": createBarChart(root, data); break;
//           case "line": createLineChart(root, data); break;
//           case "pie": createPieChart(root, data); break;
//         }
//       });
//   }

//   loadChart(chartSelect.value);
//   chartSelect.addEventListener("change", function() { loadChart(this.value); });
// });
import { createBarChart, createLineChart, createPieChart } from "./amchartsHelper.js";
import { getThemeFactory } from "./themes.js";

let currentRoot = null;
const DATA_DIR = "./chartSamples";
const fileMap = {
  bar: "barChart.json",
  line: "lineChart.json",
  pie: "pieChart.json",
};

// UI elements
const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const chartSelect = document.getElementById("chartSelect");
const themeSelect = document.getElementById("themeSelect");

function showLoading() {
  loadingEl.style.display = "flex";
  errorEl.style.display = "none";
}

function hideLoading() {
  loadingEl.style.display = "none";
}

function showError(message) {
  errorMessage.textContent = message;
  errorEl.style.display = "flex";
}

function hideError() {
  errorEl.style.display = "none";
}

function disposeRoot() {
  if (currentRoot) {
    try { 
      currentRoot.dispose(); 
    } catch (e) { 
      console.warn("Dispose failed", e); 
    }
    currentRoot = null;
  }
}

async function fetchData(type) {
  const fname = fileMap[type];
  if (!fname) throw new Error("Unknown chart type: " + type);
  
  const url = `${DATA_DIR}/${fname}`;
  const res = await fetch(url, { cache: "no-store" });
  
  if (!res.ok) {
    throw new Error(`Failed to load data: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

async function renderChart(type, themeKey) {
  try {
    disposeRoot();
    showLoading();
    hideError();
    
    // Load data from JSON file
    const data = await fetchData(type);
    
    // Create chart inside am5.ready
    am5.ready(() => {
      currentRoot = am5.Root.new("chartdiv");
      
      // Get theme factory
      const themeFactory = getThemeFactory(themeKey);
      
      // Call appropriate chart creator
      if (type === "bar") {
        createBarChart(currentRoot, data, themeFactory);
      } else if (type === "line") {
        createLineChart(currentRoot, data, themeFactory);
      } else if (type === "pie") {
        createPieChart(currentRoot, data, themeFactory);
      }
      
      hideLoading();
    });
  } catch (err) {
    disposeRoot();
    hideLoading();
    showError(err.message);
    console.error(err);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  chartSelect.addEventListener("change", () => {
    renderChart(chartSelect.value, themeSelect.value);
  });
  
  themeSelect.addEventListener("change", () => {
    renderChart(chartSelect.value, themeSelect.value);
  });
  
  // Initial load
  renderChart("bar", "Animated");
});
