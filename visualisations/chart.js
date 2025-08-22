import {
  createBarChart,
  createLineChart,
  createPieChart,
  createScatterChart,
  createHistogramChart, // <-- import the new histogram function
} from "./amchartsHelper.js";
import { getThemeFactory } from "./themes.js";

let currentRoot = null;
const DATA_DIR = "./chartSamples";

// Updated file map to include histogram.json
const fileMap = {
  bar: "barChart.json",
  line: "lineChart.json",
  pie: "pieChart.json",
  scatter: "scatterPlot.json",
  histogram: "histogram.json", // <-- added
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
    const data = await fetchData(type);

    am5.ready(() => {
      currentRoot = am5.Root.new("chartdiv");
      const themeFactory = getThemeFactory(themeKey);

      if (type === "bar") {
        createBarChart(currentRoot, data, themeFactory);
      } else if (type === "line") {
        createLineChart(currentRoot, data, themeFactory);
      } else if (type === "pie") {
        createPieChart(currentRoot, data, themeFactory);
      } else if (type === "scatter") {
        createScatterChart(currentRoot, data, themeFactory);
      } else if (type === "histogram") {
        // You can pass the field name and number of bins if needed, e.g., "score" and 10 bins
        createHistogramChart(currentRoot, data, undefined, 10, themeFactory);
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
  chartSelect.addEventListener("change", () => {
    renderChart(chartSelect.value, themeSelect.value);
  });
  themeSelect.addEventListener("change", () => {
    renderChart(chartSelect.value, themeSelect.value);
  });

  // Initial load
  renderChart("bar", "Animated");
});
