// fetch('./chartSamples/barChart.json')
//   .then(response => response.json())
//   .then(data => {
//     am5.ready(function() {
//       var root = am5.Root.new("chartdiv");

//       root.setThemes([
//         am5themes_Animated.new(root)
//       ]);

//       var chart = root.container.children.push(
//         am5xy.XYChart.new(root, {
//           panX: false,
//           panY: false,
//           wheelX: "none",
//           wheelY: "none",
//           pinchZoomX: false
//         })
//       );

//       // --- CURSOR STEP 1: CREATE THE CURSOR ---
//       // For a bar chart, we don't need the vertical line, so we disable it
//       var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
//         behavior: "none" // Disables zooming/panning with cursor
//       }));
//       cursor.lineY.set("visible", false);

//       // --- CURSOR STEP 2: CONFIGURE AXIS RENDERER & TOOLTIP ---
//       // This part is crucial for showing the axis tooltip on hover
//       var xRenderer = am5xy.AxisRendererX.new(root, {
//         minGridDistance: 30
//       });
//       xRenderer.labels.template.setAll({
//         rotation: -45,
//         centerY: am5.p50,
//         centerX: am5.p100,
//         paddingRight: 10
//       });

//       // This makes the axis tooltip visible
//       xRenderer.labels.template.set("forceHidden", false);
//       xRenderer.labels.template.set("tooltipLocation", 0); // Places tooltip above the axis label

//       var xAxis = chart.xAxes.push(
//         am5xy.CategoryAxis.new(root, {
//           categoryField: "category",
//           renderer: xRenderer,
//           // This creates the tooltip object that will be displayed
//           tooltip: am5.Tooltip.new(root, {
//             themeTags: ["axis"]
//           })
//         })
//       );

//       var yAxis = chart.yAxes.push(
//         am5xy.ValueAxis.new(root, {
//           renderer: am5xy.AxisRendererY.new(root, {})
//         })
//       );

//       var series = chart.series.push(
//         am5xy.ColumnSeries.new(root, {
//           name: "Series 1",
//           xAxis: xAxis,
//           yAxis: yAxis,
//           valueYField: "value",
//           categoryXField: "category"
//         })
//       );

//       series.columns.template.setAll({
//         tooltipText: "{categoryX}: [bold]{valueY}[/]",
//         cornerRadiusTL: 5,
//         cornerRadiusTR: 5,
//         strokeOpacity: 0
//       });

//       series.columns.template.adapters.add("fill", function(fill, target) {
//         return chart.get("colors").getIndex(series.columns.indexOf(target));
//       });

//       series.columns.template.adapters.add("stroke", function(stroke, target) {
//         return chart.get("colors").getIndex(series.columns.indexOf(target));
//       });

//       xAxis.data.setAll(data);
//       series.data.setAll(data);

//       series.appear(1000);
//       chart.appear(1000, 100);
//     });
//   })
//   .catch(err => console.error("Error loading JSON:", err));
// Choose chart type: 'bar', 'pie', or 'line'
// Default chart type
// Default chart type
// let chartType = "line";

// function loadChart(type) {
//   fetch(`/visualisations/chartSamples/${type}Chart.json`)
//     .then((response) => {
//       if (!response.ok) throw new Error(`Could not load ${type}Chart.json`);
//       return response.json();
//     })
//     .then((data) => {
//       if (type === "bar") createBarChart(data);
//       else if (type === "line") createLineChart(data);
//       else if (type === "pie") createPieChart(data);
//     })
//     .catch((err) => {
//       console.error(err);
//       document.getElementById(
//         "chartdiv"
//       ).innerHTML = `Error: Could not load data for ${type} chart.`;
//     });
// }

// // Load default chart
// loadChart(chartType);

// // Dropdown to switch charts dynamically
// document.getElementById("chartSelect").addEventListener("change", function () {
//   chartType = this.value;
//   loadChart(chartType);
// });
//upper code functional no1

// File: /visualisations/chart.js

// This single file contains all the necessary logic.

// --- Main Execution ---
// This ensures all amCharts libraries are loaded before we do anything.
// File: /visualisations/chart.js

// This single file contains all the necessary logic.

// This ensures all amCharts libraries are loaded before we do anything.
// This single file contains all the necessary logic.

// am5.ready(function() {

//   let currentChartRoot = null;
//   const chartSelect = document.getElementById("chartSelect");

//   function loadChart(type) {
//     fetch(`./chartSamples/${type}Chart.json`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`Network response was not ok: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then(data => {
//         if (currentChartRoot) {
//           currentChartRoot.dispose();
//         }

//         let root = am5.Root.new("chartdiv");
//         root.setThemes([am5themes_Animated.new(root)]);
//         currentChartRoot = root;

//         // =================== BAR CHART LOGIC (Corrected) ===================
//         if (type === "bar") {
//           // 1. Create the chart first
//           const chart = root.container.children.push(
//             am5xy.XYChart.new(root, {
//               panX: false,
//               panY: false,
//               wheelX: "none",
//               wheelY: "none"
//             })
//           );

//           // 2. Create and configure the Y-axis
//           const yAxis = chart.yAxes.push(
//             am5xy.ValueAxis.new(root, {
//               renderer: am5xy.AxisRendererY.new(root, {})
//             })
//           );

//           // 3. Create and configure the X-axis
//           const xAxis = chart.xAxes.push(
//             am5xy.CategoryAxis.new(root, {
//               categoryField: "category",
//               renderer: am5xy.AxisRendererX.new(root, {}),
//               tooltip: am5.Tooltip.new(root, {})
//             })
//           );
//           xAxis.data.setAll(data); // Set data on the axis

//           // 4. Create the series and link it to the axes
//           const series = chart.series.push(
//             am5xy.ColumnSeries.new(root, {
//               name: "Series",
//               xAxis: xAxis,
//               yAxis: yAxis,
//               valueYField: "value",
//               categoryXField: "category",
//               tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" })
//             })
//           );
//           series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
//           series.columns.template.adapters.add("fill", (fill, target) => chart.get("colors").getIndex(series.columns.indexOf(target)));
//           series.data.setAll(data); // Set data on the series
//           series.appear(1000);
//           chart.appear(1000, 100);

//         }
//         // =================== LINE CHART LOGIC (Corrected) ===================
//         else if (type === "line") {
//           // 1. Create the chart
//           const chart = root.container.children.push(
//             am5xy.XYChart.new(root, {
//               pinchZoomX: true
//             })
//           );

//           // 2. Create Axes
//           const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
//             renderer: am5xy.AxisRendererY.new(root, {})
//           }));
//           const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
//             categoryField: "category",
//             renderer: am5xy.AxisRendererX.new(root, {}),
//             tooltip: am5.Tooltip.new(root, {})
//           }));
//           xAxis.data.setAll(data);

//           // 3. Create Series
//           const series = chart.series.push(
//             am5xy.LineSeries.new(root, {
//               name: "Series",
//               xAxis: xAxis,
//               yAxis: yAxis,
//               valueYField: "value",
//               categoryXField: "category",
//               tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" })
//             })
//           );
//           series.bullets.push(() => am5.Bullet.new(root, {
//             sprite: am5.Circle.new(root, { radius: 5, fill: series.get("fill") })
//           }));
//           series.data.setAll(data);
//           series.appear(1000);
//           chart.appear(1000, 100);

//           // 4. Add cursor
//           chart.set("cursor", am5xy.XYCursor.new(root, {}));
//         }
//         // =================== PIE CHART LOGIC (Working) ===================
//         else if (type === "pie") {
//           const chart = root.container.children.push(
//             am5percent.PieChart.new(root, {
//               layout: root.verticalLayout,
//               innerRadius: am5.percent(50)
//             })
//           );
//           const series = chart.series.push(
//             am5percent.PieSeries.new(root, {
//               valueField: "value",
//               categoryField: "category"
//             })
//           );
//           series.slices.template.setAll({
//             tooltipText: "{category}: [bold]{value} ({valuePercentTotal.formatNumber('0.0')}%)[/]",
//             toggleKey: "active"
//           });
//           series.data.setAll(data);
//           const legend = chart.children.push(
//             am5.Legend.new(root, {
//               centerX: am5.p50,
//               x: am5.p50,
//               marginTop: 15
//             })
//           );
//           legend.data.setAll(series.dataItems);
//           series.appear(1000, 100);
//         }
//       })
//       .catch(err => {
//         console.error("Error details:", err);
//         document.getElementById("chartdiv").innerHTML = `<b>Error:</b> Could not load or render chart. <br>Details: ${err.message}.`;
//       });
//   }

//   // --- Initial Load and Event Listener ---
//   loadChart(chartSelect.value);
//   chartSelect.addEventListener("change", function() {
//     loadChart(this.value);
//   });

// });
//uppercode is lifesaver
// File: /visualisations/chart.js

// IMPORT the functions from the helper file
// File: /visualisations/chart.js

// IMPORT the functions from the helper file
// import { createBarChart, createLineChart, createPieChart } from './amchartsHelper.js';

// am5.ready(function() {
//   let currentChartRoot = null;
//   const chartSelect = document.getElementById("chartSelect");

//   function loadChart(type) {
//     fetch(`./chartSamples/${type}Chart.json`) // Corrected path for same directory
//       .then(response => {
//         if (!response.ok) throw new Error(`Network response was not ok`);
//         return response.json();
//       })
//       .then(data => {
//         if (currentChartRoot) {
//           currentChartRoot.dispose();
//         }

//         let root = am5.Root.new("chartdiv");
//         root.setThemes([am5themes_Animated.new(root)]);
//         currentChartRoot = root;

//         // Use a switch statement for cleaner code
//         switch (type) {
//           case "bar":
//             createBarChart(root, data);
//             break;
//           case "line":
//             createLineChart(root, data);
//             break;
//           case "pie":
//             createPieChart(root, data);
//             break;
//         }
//       })
//       .catch(err => {
//         console.error("Error details:", err);
//       });
//   }

//   loadChart(chartSelect.value);
//   chartSelect.addEventListener("change", function () {
//     loadChart(this.value);
//   });
// });

import { createBarChart, createLineChart, createPieChart } from "./amchartsHelper.js";

am5.ready(function() {
  let currentChartRoot = null;
  const chartSelect = document.getElementById("chartSelect");

  function loadChart(type) {
    fetch(`./chartSamples/${type}Chart.json`)
      .then(res => res.json())
      .then(data => {
        if(currentChartRoot) currentChartRoot.dispose();
        const root = am5.Root.new("chartdiv");
        root.setThemes([am5themes_Animated.new(root)]);
        currentChartRoot = root;

        switch(type) {
          case "bar": createBarChart(root, data); break;
          case "line": createLineChart(root, data); break;
          case "pie": createPieChart(root, data); break;
        }
      });
  }

  loadChart(chartSelect.value);
  chartSelect.addEventListener("change", function() { loadChart(this.value); });
});
