// for bar chart
// export function createBarChart(root, data) {
//   const chart = root.container.children.push(
//     am5xy.XYChart.new(root, {
//       panX: true,
//       panY: true,
//       wheelX: "panX",
//       wheelY: "zoomX",
//       pinchZoomX: true,
//     })
//   );

//   // --- NEW: Create Cursor ---
//   const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
//   //   cursor.lineY.set("visible", false);

//   // Create Axes
//   const xAxis = chart.xAxes.push(
//     am5xy.CategoryAxis.new(root, {
//       categoryField: "category",
//       renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
//       // --- NEW: Add Axis Tooltip ---
//       tooltip: am5.Tooltip.new(root, {}),
//     })
//   );

//   const yAxis = chart.yAxes.push(
//     am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
//   );

//   // Create Series
//   const series = chart.series.push(
//     am5xy.ColumnSeries.new(root, {
//       xAxis,
//       yAxis,
//       valueYField: "value",
//       categoryXField: "category",
//       tooltip: am5.Tooltip.new(root, {
//         labelText: "{categoryX}: [bold]{valueY}[/]",
//       }),
//     })
//   );
//   series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
//   series.columns.template.adapters.add("fill", (fill, target) =>
//     chart.get("colors").getIndex(series.columns.indexOf(target))
//   );

//   // --- NEW: Add Hover State ---
//   series.columns.template.states.create("hover", {
//     fillOpacity: 0.7,
//     scale: 1.05,
//   });

//   // --- NEW: Add Scrollbar ---
//   chart.set(
//     "scrollbarX",
//     am5.Scrollbar.new(root, { orientation: "horizontal" })
//   );

//   // Set Data
//   xAxis.data.setAll(data);
//   series.data.setAll(data);
//   series.appear(500);
//   chart.appear(500, 100);
// }

// export function createLineChart(root, data) {
//   // Create chart
//   const chart = root.container.children.push(
//     am5xy.XYChart.new(root, {
//       panX: true,
//       panY: true,
//       wheelX: "panX",
//       wheelY: "zoomX",
//       pinchZoomX: true,
//     })
//   );
//   chart.set(
//     "scrollbarX",
//     am5.Scrollbar.new(root, {
//       orientation: "horizontal",
//     })
//   );
//   // Create X Axis
//   const xAxis = chart.xAxes.push(
//     am5xy.CategoryAxis.new(root, {
//       categoryField: "category",
//       renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
//       tooltip: am5.Tooltip.new(root, {}),
//     })
//   );

//   // Create Y Axis
//   const yAxis = chart.yAxes.push(
//     am5xy.ValueAxis.new(root, {
//       renderer: am5xy.AxisRendererY.new(root, {}),
//     })
//   );

//   // Add Cursor
//   const cursor = chart.set(
//     "cursor",
//     am5xy.XYCursor.new(root, {
//       behavior: "zoomX",
//       xAxis: xAxis,
//     })
//   );
//   //   cursor.lineY.set("visible", false);

//   // Create Line Series
//   const series = chart.series.push(
//     am5xy.LineSeries.new(root, {
//       name: "Series", // For Legend
//       xAxis: xAxis,
//       yAxis: yAxis,
//       valueYField: "value",
//       categoryXField: "category",
//       tooltip: am5.Tooltip.new(root, {
//         labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
//       }),
//     })
//   );

//   // Add bullets with hover effect
//   series.bullets.push(function () {
//     const circle = am5.Circle.new(root, {
//       radius: 5,
//       fill: series.get("fill"),
//       stroke: root.interfaceColors.get("background"),
//       strokeWidth: 2,
//     });

//     circle.states.create("hover", { scale: 1.5 });

//     return am5.Bullet.new(root, {
//       sprite: circle,
//     });
//   });

//   // Add Legend
//   const legend = chart.children.push(
//     am5.Legend.new(root, {
//       centerX: am5.p50,
//       x: am5.p50,
//       marginTop: 15,
//     })
//   );
//   legend.data.setAll(chart.series.values);

//   // Set data
//   xAxis.data.setAll(data);
//   series.data.setAll(data);

//   // Animate series and chart
//   series.appear(1000);
//   chart.appear(1000, 100);
// }

// export function createPieChart(root, data) {
//   const chart = root.container.children.push(
//     am5percent.PieChart.new(root, {
//       layout: root.verticalLayout,
//       innerRadius: am5.percent(50),
//     })
//   );

//   // Create Series
//   const series = chart.series.push(
//     am5percent.PieSeries.new(root, {
//       valueField: "value",
//       categoryField: "category",
//       alignLabels: true, // --- NEW: Better label alignment
//     })
//   );

//   series.slices.template.setAll({
//     tooltipText:
//       "{category}: [bold]{value} ({valuePercentTotal.formatNumber('0.0')}%)[/]",
//     toggleKey: "active",
//   });

//   // --- NEW: Add Hover State ---
//   series.slices.template.states.create("hover", {
//     scale: 1.05,
//   });

//   // --- NEW: Improved Labels & Ticks ---
//   series.labels.template.setAll({
//     radius: 10,
//     text: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
//   });
//   series.ticks.template.setAll({
//     forceHidden: false,
//   });

//   // Set Data
//   series.data.setAll(data);

//   // --- NEW: Add Centered Total Label ---
//   const total = data.reduce((acc, item) => acc + item.value, 0);
//   const totalLabel = am5.Label.new(root, {
//     text: `Total\n[bold]${total.toLocaleString()}[/]`,
//     fontSize: 20,
//     textAlign: "center",
//     centerX: am5.p50,
//     centerY: am5.p50,
//   });
//   chart.seriesContainer.children.push(totalLabel);

//   // Create Legend
//   const legend = chart.children.push(
//     am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 15 })
//   );
//   legend.data.setAll(series.dataItems);

//   // Animate
//   series.appear(1000, 100);
// }

// amchartsHelper.js
// ===== Safe Theme Application =====
// amchartsHelper.js - Updated theme handling

// amchartsHelper.js
// ===== Safe Theme Application =====
// **
//  * amcharthelper.js (Fixed)
//  * * This file contains corrected functions for creating amCharts.
//  * - Fixes the error in the bar chart color adapter.
//  * - Simplifies the theming logic to directly accept an array of color strings.
//  * - This approach relies on the main script to pass a large, non-repeating
//  * color array when that specific theme is selected by the user.
//  */

// amchartsHelper.js
// ===== Safe Theme Application =====
// amchartsHelper.js
// ===== Safe Theme Application =====
// amchartsHelper.js
// ===== Safe Theme Application =====
// amchartsHelper.js
// ===== Safe Theme Application =====
/**
 * amchartsHelper.js
 * This file contains shared helper functions for creating amCharts instances.
 * - Centralized theme application.
 * - Flexible data format detection and conversion.
 */

// ===== Shared Helper Functions =====

/**
 * Applies the base Animated theme and an optional custom theme.
 * @param {am5.Root} root The root element.
 * @param {Function} [themeFactory] An optional function that returns a theme instance.
 */
function applyThemes(root, themeFactory) {
  const themeInstances = [am5themes_Animated.new(root)];

  if (themeFactory && typeof themeFactory === "function") {
    try {
      const customTheme = themeFactory(root);
      if (customTheme) {
        themeInstances.push(customTheme);
      }
    } catch (e) {
      console.warn("Custom theme factory failed to execute:", e);
    }
  }

  root.setThemes(themeInstances);
}

/**
 * Detects the structure of the input data.
 * @param {Array|Object} data The chart data.
 * @returns {String} "single-series", "multi-series", "explicit-multi-series", or "unknown".
 */
function detectDataStructure(data) {
  if (!Array.isArray(data)) {
    if (data && data.categories && data.series) {
      return "explicit-multi-series";
    }
  } else if (data.length > 0) {
    const firstItem = data[0];
    if (firstItem.category !== undefined && firstItem.value !== undefined && Object.keys(firstItem).length === 2) {
      return "single-series";
    }
    if (firstItem.category !== undefined && Object.keys(firstItem).length > 2) {
      return "multi-series";
    }
  }
  return "unknown";
}

/**
 * Converts different data formats into a consistent "explicit-multi-series" format.
 * @param {Array|Object} data The chart data.
 * @returns {Object} Data in { categories: [...], series: [...] } format.
 */
function convertToExplicitFormat(data) {
  const format = detectDataStructure(data);

  if (format === "single-series") {
    return {
      categories: data.map(item => item.category),
      series: [{
        name: "Value", // Default series name
        values: data.map(item => item.value)
      }]
    };
  } else if (format === "multi-series") {
    const categories = data.map(item => item.category);
    const seriesNames = Object.keys(data[0]).filter(key => key !== "category");

    return {
      categories,
      series: seriesNames.map(name => ({
        name,
        values: data.map(item => item[name])
      }))
    };
  }

  // If it's already in the correct format or unknown, return as is.
  return data;
}

// =========================
// Chart Creation Functions
// =========================

export function createBarChart(root, data, themeFactory) {
  applyThemes(root, themeFactory);

  const formattedData = convertToExplicitFormat(data);
  const { categories, series: seriesData } = formattedData;

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  chart.set("cursor", am5xy.XYCursor.new(root, {}));

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 30,
        cellStartLocation: 0.1,
        cellEndLocation: 0.9
      }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0
    })
  );

  xAxis.data.setAll(categories.map(category => ({ category })));

  seriesData.forEach((seriesInfo, seriesIndex) => {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: seriesInfo.name,
        xAxis,
        yAxis,
        valueYField: "value",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0
    });
    
    // This logic correctly colors individual bars in a single series, 
    // or entire series in a multi-series chart. It's good.
    if (seriesData.length === 1) {
      series.columns.template.adapters.add("fill", (fill, target) => {
        const index = series.columns.indexOf(target);
        return chart.get("colors").getIndex(index);
      });
    }

    series.columns.template.states.create("hover", {
      fillOpacity: 0.7,
      scale: 1.03
    });

    series.data.setAll(categories.map((category, i) => ({
      category,
      value: seriesInfo.values[i]
    })));
    
    series.appear(500);
  });
  
  // Only add legend if there are multiple series to identify
  if (seriesData.length > 1) {
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      marginTop: 15
    }));
    legend.data.setAll(chart.series.values);
  }

  if (categories.length > 15) {
    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
  }

  chart.appear(500, 100);
}


export function createLineChart(root, data, themeFactory) {
  applyThemes(root, themeFactory);

  const formattedData = convertToExplicitFormat(data);
  const { categories, series: seriesData } = formattedData;

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
      tooltip: am5.Tooltip.new(root, {})
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0
    })
  );
  
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "zoomX",
      xAxis: xAxis
  }));
  cursor.lineY.set("visible", false);
  
  xAxis.data.setAll(categories.map(category => ({ category })));

  seriesData.forEach((seriesInfo) => {
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: seriesInfo.name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
        }),
        strokeWidth: 2,
      })
    );
    
    // **FIXED**: Make the area fill color derive from the series' stroke color.
    // This ensures it respects the theme.
    series.fills.template.setAll({
        fillOpacity: 0.2,
        visible: true
    });

    series.bullets.push(function() {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get("stroke"), // Correctly gets color from the series
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2
        })
      });
    });

    series.data.setAll(categories.map((category, i) => ({
      category,
      value: seriesInfo.values[i]
    })));
    
    series.appear(1000);
  });

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50,
    marginTop: 15,
    marginBottom: 15
  }));
  legend.data.setAll(chart.series.values);

  if (categories.length > 15) {
    chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));
  }

  chart.appear(1000, 100);
}


export function createPieChart(root, data, themeFactory) {
  applyThemes(root, themeFactory);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(50),
      // Add padding to give labels more space at the edges
      paddingLeft: 20,
      paddingRight: 20,
    })
  );

  const series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: true,
    })
  );

  series.slices.template.setAll({
    tooltipText: "{category}: [bold]{valuePercentTotal.formatNumber('0.0')}%[/]",
    stroke: am5.color(0xffffff),
    strokeWidth: 2,
  });

  // --- ADJUSTED LABEL CONFIGURATION ---
  series.labels.template.setAll({
    fontSize: "0.9em",
    text: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
    // Set a base distance from the center
    radius: 15,
  });

  series.labels.template.adapters.add("centerX", function (x, target) {
    if (target.dataItem) {
      const angle = target.dataItem.get("angle", 0) + target.dataItem.get("shiftAngle", 0);
      // Position on the right side
      if (angle < 90 || angle > 270) {
        return am5.p100;
      }
      // Position on the left side
      return am5.p0;
    }
    return x;
  });

  series.labels.template.adapters.add("textAlign", function (align, target) {
    if (target.dataItem) {
      const angle = target.dataItem.get("angle", 0) + target.dataItem.get("shiftAngle", 0);
      if (angle < 90 || angle > 270) {
        return "start";
      }
      return "end";
    }
    return align;
  });

  // --- SIMPLIFIED TICK CONFIGURATION (THE FIX) ---
  series.ticks.template.setAll({
    // Make sure ticks are always visible
    forceHidden: false, 
  });

  series.data.setAll(data);
  
  const total = data.reduce((acc, item) => acc + item.value, 0);
  chart.seriesContainer.children.push(am5.Label.new(root, {
    text: `Total\n[bold]${total.toLocaleString()}[/]`,
    fontSize: 24,
    textAlign: "center",
    centerX: am5.p50,
    centerY: am5.p50,
  }));

  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      marginTop: 15,
      marginBottom: 15,
    })
  );
  legend.data.setAll(series.dataItems);
  
  series.appear(1000, 100);
}