/**
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
    if (
      firstItem.category !== undefined &&
      firstItem.value !== undefined &&
      Object.keys(firstItem).length === 2
    ) {
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
      categories: data.map((item) => item.category),
      series: [
        {
          name: "Value", // Default series name
          values: data.map((item) => item.value),
        },
      ],
    };
  } else if (format === "multi-series") {
    const categories = data.map((item) => item.category);
    const seriesNames = Object.keys(data[0]).filter(
      (key) => key !== "category"
    );

    return {
      categories,
      series: seriesNames.map((name) => ({
        name,
        values: data.map((item) => item[name]),
      })),
    };
  } // If it's already in the correct format or unknown, return as is.

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
        cellEndLocation: 0.9,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0,
    })
  );

  xAxis.data.setAll(categories.map((category) => ({ category })));

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
      strokeOpacity: 0,
    });
    if (seriesData.length === 1) {
      series.columns.template.adapters.add("fill", (fill, target) => {
        const index = series.columns.indexOf(target);
        return chart.get("colors").getIndex(index);
      });
    }

    series.columns.template.states.create("hover", {
      fillOpacity: 0.7,
      scale: 1.03,
    });

    series.data.setAll(
      categories.map((category, i) => ({
        category,
        value: seriesInfo.values[i],
      }))
    );
    series.appear(500);
  });
  if (seriesData.length > 1) {
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
      })
    );
    legend.data.setAll(chart.series.values);
  }

  if (categories.length > 15) {
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );
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
      pinchZoomX: true,
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0,
    })
  );
  const cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "zoomX",
      xAxis: xAxis,
    })
  );
  cursor.lineY.set("visible", false);
  xAxis.data.setAll(categories.map((category) => ({ category })));

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
    series.fills.template.setAll({
      fillOpacity: 0.2,
      visible: true,
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get("stroke"),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
        }),
      });
    });

    series.data.setAll(
      categories.map((category, i) => ({
        category,
        value: seriesInfo.values[i],
      }))
    );
    series.appear(1000);
  });

  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      marginTop: 15,
      marginBottom: 15,
    })
  );
  legend.data.setAll(chart.series.values);

  if (categories.length > 15) {
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, { orientation: "horizontal" })
    );
  }

  chart.appear(1000, 100);
}

export function createPieChart(root, data, themeFactory) {
  applyThemes(root, themeFactory);

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(50),
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
    tooltipText:
      "{category}: [bold]{valuePercentTotal.formatNumber('0.0')}%[/]",
    stroke: am5.color(0xffffff),
    strokeWidth: 2,
  });

  series.labels.template.setAll({
    fontSize: "0.9em",
    text: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
    radius: 15,
  });

  series.labels.template.adapters.add("centerX", function (x, target) {
    if (target.dataItem) {
      const angle =
        target.dataItem.get("angle", 0) + target.dataItem.get("shiftAngle", 0);
      if (angle < 90 || angle > 270) {
        return am5.p100;
      }
      return am5.p0;
    }
    return x;
  });

  series.labels.template.adapters.add("textAlign", function (align, target) {
    if (target.dataItem) {
      const angle =
        target.dataItem.get("angle", 0) + target.dataItem.get("shiftAngle", 0);
      if (angle < 90 || angle > 270) {
        return "start";
      }
      return "end";
    }
    return align;
  });

  series.ticks.template.setAll({
    forceHidden: false,
  });

  series.data.setAll(data);
  const total = data.reduce((acc, item) => acc + item.value, 0);
  chart.seriesContainer.children.push(
    am5.Label.new(root, {
      text: `Total\n[bold]${total.toLocaleString()}[/]`,
      fontSize: 24,
      textAlign: "center",
      centerX: am5.p50,
      centerY: am5.p50,
    })
  );

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

/**
 * Creates a scatter plot chart with flexible data key detection.
 * @param {am5.Root} root The root element.
 * @param {Array<Object>} data The chart data, e.g., [{x: 1, y: 5}, {x: 2, y: 8}]
 * @param {Function} [themeFactory] An optional function that returns a theme instance.
 */
export function createScatterChart(root, data, themeFactory) {
  applyThemes(root, themeFactory);

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Scatter chart: empty or invalid data");
    return;
  } // Group data by series name (default to "Default Series" if none)

  const seriesGroups = {};
  data.forEach((item) => {
    const seriesName = item.series || "Default Series";
    if (!seriesGroups[seriesName]) seriesGroups[seriesName] = [];
    seriesGroups[seriesName].push(item);
  });

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomXY",
      pinchZoomX: true,
      pinchZoomY: true,
    })
  );

  chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomXY" })); // Create axes

  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );
  xAxis.children.push(
    am5.Label.new(root, { text: "X Value", x: am5.p50, centerX: am5.p50 })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );
  yAxis.children.push(
    am5.Label.new(root, {
      text: "Y Value",
      rotation: -90,
      y: am5.p50,
      centerY: am5.p50,
    })
  ); // Create series

  Object.keys(seriesGroups).forEach((seriesName) => {
    const seriesData = seriesGroups[seriesName]; // Automatically detect first two numeric fields for x and y

    const numericKeys = Object.keys(seriesData[0]).filter(
      (k) => typeof seriesData[0][k] === "number"
    );
    if (numericKeys.length < 2) {
      console.warn(
        `Series "${seriesName}" does not have enough numeric fields for a scatter plot.`
      );
      return; // Skip this series if it's invalid
    }
    const xKey = numericKeys[0];
    const yKey = numericKeys[1];

    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: seriesName,
        xAxis,
        yAxis,
        valueXField: "x", // We will map to these fields
        valueYField: "y",
        tooltip: am5.Tooltip.new(root, {
          labelText: `[bold]{name}[/]\n${xKey}: {valueX}\n${yKey}: {valueY}`,
        }),
      })
    ); // Map the detected keys to the standard 'x' and 'y' fields

    series.data.setAll(
      seriesData.map((item) => ({ x: item[xKey], y: item[yKey] }))
    ); // Hide the connecting line to make it a scatter plot

    series.strokes.template.set("visible", false); // Add bullets (the dots)

    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get("fill"),
          stroke: root.interfaceColors.get("background"),
          strokeWidth: 2,
        }),
      })
    );

    series.appear(1000);
  }); // Add legend if there are multiple series

  if (Object.keys(seriesGroups).length > 1) {
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 15,
      })
    );
    legend.data.setAll(chart.series.values);
  }

  chart.appear(1000, 100);
}

/**
 * Creates a histogram chart by automatically binning numeric data.
 * @param {am5.Root} root The root element.
 * @param {Array<Object>} data The raw data, e.g., [{score: 72}, {score: 85}, ...]
 * @param {String} [field] Optional: The numeric field to plot. Auto-detected if omitted.
 * @param {Number} [bins=10] Optional: The number of bins to create.
 * @param {Function} [themeFactory] An optional function that returns a theme instance.
 */
export function createHistogramChart(
  root,
  data,
  field,
  bins = 10,
  themeFactory
) {
  applyThemes(root, themeFactory);

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Histogram chart: empty or invalid data");
    return;
  } // Auto-detect numeric field if not provided

  if (!field) {
    const firstItem = data[0];
    const numericKeys = Object.keys(firstItem).filter(
      (k) => typeof firstItem[k] === "number"
    );
    if (numericKeys.length === 0) {
      console.warn("Histogram chart: No numeric data field found.");
      return;
    }
    field = numericKeys[0];
  } // Binning logic

  const values = data.map((d) => d[field]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;
  const binCounts = new Array(bins).fill(0);

  values.forEach((val) => {
    let binIndex = Math.floor((val - min) / binSize);
    if (binIndex >= bins) binIndex = bins - 1; // Clamp max value to the last bin
    binCounts[binIndex]++;
  }); // Prepare chart data

  const chartData = binCounts.map((count, i) => {
    const start = min + i * binSize;
    const end = start + binSize;
    return { start, end, count };
  });

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  // Add a cursor for interactivity
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineY.set("visible", false); // X-axis (ValueAxis for continuous data)

  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      min: min,
      max: max,
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
    })
  );

  // Add a label to the X-axis
  xAxis.children.push(
    am5.Label.new(root, { text: field, x: am5.p50, centerX: am5.p50 })
  ); // Y-axis

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      min: 0,
    })
  );

  // Add a label to the Y-axis
  yAxis.children.moveValue(
    am5.Label.new(root, {
      text: "Frequency",
      rotation: -90,
      y: am5.p50,
      centerX: am5.p50,
    }),
    0
  ); // Column series that spans from a start to an end value on the X-axis

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis,
      yAxis,
      valueYField: "count",
      openValueXField: "start",
      valueXField: "end",
      tooltip: am5.Tooltip.new(root, {
        labelText: `Range: {openValueX.formatNumber('#.##')} - {valueX.formatNumber('#.##')}\nFrequency: {valueY}`,
      }),
    })
  );

  series.columns.template.setAll({
    cornerRadiusTL: 0, //for separtion in histogram
    cornerRadiusTR: 0,
    stroke: root.interfaceColors.get("background"),
    strokeWidth: 0,
  });

  series.columns.template.states.create("hover", {
    fillOpacity: 0.7,
  });

  series.data.setAll(chartData);

  chart.appear(500, 100);
}
