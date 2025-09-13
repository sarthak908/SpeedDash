// import {
//   createBarChart,
//   createLineChart,
//   createPieChart,
//   createScatterChart,
//   createHistogramChart, // <-- import the new histogram function
// } from "./amchartsHelper.js";
// import { getThemeFactory } from "./themes.js";

// let currentRoot = null;
// const DATA_DIR = "./chartSamples";

// // Updated file map to include histogram.json
// const fileMap = {
//   bar: "barChart.json",
//   line: "lineChart.json",
//   pie: "pieChart.json",
//   scatter: "scatterPlot.json",
//   histogram: "histogram.json", // <-- added
// };

// // UI elements
// const loadingEl = document.getElementById("loading");
// const errorEl = document.getElementById("error");
// const errorMessage = document.getElementById("error-message");
// const chartSelect = document.getElementById("chartSelect");
// const themeSelect = document.getElementById("themeSelect");

// function showLoading() {
//   loadingEl.style.display = "flex";
//   errorEl.style.display = "none";
// }

// function hideLoading() {
//   loadingEl.style.display = "none";
// }

// function showError(message) {
//   errorMessage.textContent = message;
//   errorEl.style.display = "flex";
// }

// function hideError() {
//   errorEl.style.display = "none";
// }

// function disposeRoot() {
//   if (currentRoot) {
//     try {
//       currentRoot.dispose();
//     } catch (e) {
//       console.warn("Dispose failed", e);
//     }
//     currentRoot = null;
//   }
// }

// async function fetchData(type) {
//   const fname = fileMap[type];
//   if (!fname) throw new Error("Unknown chart type: " + type);
//   const url = `${DATA_DIR}/${fname}`;
//   const res = await fetch(url, { cache: "no-store" });
//   if (!res.ok) {
//     throw new Error(`Failed to load data: ${res.status} ${res.statusText}`);
//   }
//   return res.json();
// }

// async function renderChart(type, themeKey) {
//   try {
//     disposeRoot();
//     showLoading();
//     hideError();
//     const data = await fetchData(type);

//     am5.ready(() => {
//       currentRoot = am5.Root.new("chartdiv");
//       const themeFactory = getThemeFactory(themeKey);

//       if (type === "bar") {
//         createBarChart(currentRoot, data, themeFactory);
//       } else if (type === "line") {
//         createLineChart(currentRoot, data, themeFactory);
//       } else if (type === "pie") {
//         createPieChart(currentRoot, data, themeFactory);
//       } else if (type === "scatter") {
//         createScatterChart(currentRoot, data, themeFactory);
//       } else if (type === "histogram") {
//         // You can pass the field name and number of bins if needed, e.g., "score" and 10 bins
//         createHistogramChart(currentRoot, data, undefined, 10, themeFactory);
//       }

//       hideLoading();
//     });
//   } catch (err) {
//     disposeRoot();
//     hideLoading();
//     showError(err.message);
//     console.error(err);
//   }
// }

// // Initialize the application
// document.addEventListener("DOMContentLoaded", () => {
//   chartSelect.addEventListener("change", () => {
//     renderChart(chartSelect.value, themeSelect.value);
//   });
//   themeSelect.addEventListener("change", () => {
//     renderChart(chartSelect.value, themeSelect.value);
//   });

//   // Initial load
//   renderChart("bar", "Animated");
// });

import {
  createBarChart,
  createLineChart,
  createPieChart,
  createScatterChart,
  createHistogramChart,
} from "./amchartsHelper.js";
import { getThemeFactory } from "./themes.js";

let currentRoot = null;
let lastChartData = null; // ✅ 1. ADD THIS VARIABLE

const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const errorMessage = document.getElementById("error-message");
const sqlFileInput = document.getElementById("sqlFileInput");
const userQueryInput = document.getElementById("userQueryInput");
const generateChartBtn = document.getElementById("generateChartBtn");
const themeSelect = document.getElementById("themeSelect"); // Make sure this is here

function showLoading() {
  document.getElementById("chartdiv").innerHTML = "";
  loadingEl.style.display = "flex";
  errorEl.style.display = "none";
}

function hideLoading() {
  loadingEl.style.display = "none";
}

function showError(message) {
  hideLoading();
  errorMessage.textContent = message;
  errorEl.style.display = "flex";
}

function hideError() {
  errorEl.style.display = "none";
}

function disposeRoot() {
  if (currentRoot) {
    currentRoot.dispose();
    currentRoot = null;
  }
}

function getUploadedSQLContent() {
  return new Promise((resolve, reject) => {
    const file = sqlFileInput.files[0];
    if (!file) {
      return reject("No SQL file selected.");
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject("Error reading file: " + error);
    };
    reader.readAsText(file);
  });
}

async function generateDynamicChart() {
  hideError();
  disposeRoot();
  showLoading();

  try {
    const sqlContent = await getUploadedSQLContent();
    const userPrompt = userQueryInput.value;

    if (!userPrompt) {
      throw new Error("Please describe the chart you want.");
    }

    const response = await fetch(
      "http://localhost:5000/api/openai/generate-chart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sqlContent, userPrompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();

    if (result.success) {
      lastChartData = result.data; // ✅ Store the successful data
      // Set the dropdown to the AI's suggested theme
      if (result.data.theme && themeSelect) {
          themeSelect.value = result.data.theme;
      }
      renderChart(lastChartData.chartType, lastChartData.chartData);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error generating chart:", error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}
function renderChart(type, data) {
  disposeRoot();
  am5.ready(() => {
    currentRoot = am5.Root.new("chartdiv");
    const themeKey = themeSelect.value; // Get the currently selected theme name

    switch (type) {
      case "bar":
        createBarChart(currentRoot, data, themeKey);
        break;
      case "line":
        createLineChart(currentRoot, data, themeKey);
        break;
      case "pie":
        createPieChart(currentRoot, data, themeKey); // ✅ Change this
        break;
      case "scatter":
        createScatterChart(currentRoot, data, themeKey); // ✅ Change this
        break;
      case "histogram":
        createHistogramChart(currentRoot, data, themeKey);
        break;
      default:
        showError(`Unknown chart type: "${type}"`);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  generateChartBtn.addEventListener("click", generateDynamicChart);

  // ✅ 2. ADD THIS EVENT LISTENER
  themeSelect.addEventListener("change", () => {
    if (lastChartData) {
      // If we have data, re-render the chart with the new theme
      renderChart(lastChartData.chartType, lastChartData.chartData);
    }
  });
});