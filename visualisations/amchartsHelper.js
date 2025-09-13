import { getThemeFactory } from "./themes.js";

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

// =========================
// Chart Creation Functions
// =========================

export function createBarChart(root, data, themeKey) {
  applyThemes(root, getThemeFactory(themeKey));

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  const isMultiSeries = !Array.isArray(data);
  const categories = isMultiSeries ? data.categories : data.map((d) => d.category);

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
      }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );
  xAxis.data.setAll(categories.map((c) => ({ category: c })));

  function createSeries(name, field) {
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {categoryX}, {valueY}",
        }),
      })
    );
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
    series.appear();
    return series;
  }

  if (isMultiSeries) {
    data.series.forEach((s) => {
      createSeries(s.name, s.name);
    });
    const finalData = categories.map((cat, i) => {
      const row = { category: cat };
      data.series.forEach((s) => {
        row[s.name] = s.data[i];
      });
      return row;
    });
    chart.series.each((s) => s.data.setAll(finalData));
  } else {
    const singleSeries = createSeries("Value", "value");
    singleSeries.data.setAll(data);

    // ✅ CORRECT ADAPTER for single-series bar charts
    singleSeries.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(singleSeries.columns.indexOf(target));
    });
    singleSeries.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(singleSeries.columns.indexOf(target));
    });
  }

  if (isMultiSeries) {
    const legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
    }));
    legend.data.setAll(chart.series.values);
  }

  chart.set("cursor", am5xy.XYCursor.new(root, {}));
  chart.appear(1000, 100);
}

export function createLineChart(root, data, themeKey) {
  applyThemes(root, getThemeFactory(themeKey));

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  const isMultiSeries = !Array.isArray(data);
  const categories = isMultiSeries ? data.categories : data.map((d) => d.category);

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );
  xAxis.data.setAll(categories.map((c) => ({ category: c })));

  function createSeries(name, field) {
    const series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: field,
        categoryXField: "category",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{name}: {valueY}",
        }),
      })
    );
    series.strokes.template.set("strokeWidth", 2);
    series.bullets.push(() =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 5,
          fill: series.get("fill"),
        }),
      })
    );
    series.appear();
  }

  if (isMultiSeries) {
    data.series.forEach((s) => {
      createSeries(s.name, s.name);
    });
    const finalData = categories.map((cat, i) => {
      const row = { category: cat };
      data.series.forEach((s) => {
        row[s.name] = s.data[i];
      });
      return row;
    });
    chart.series.each((s) => s.data.setAll(finalData));
  } else {
    createSeries("Value", "value");
    chart.series.getIndex(0).data.setAll(data);
  }

  const legend = chart.children.push(am5.Legend.new(root, {
    centerX: am5.p50,
    x: am5.p50
  }));
  legend.data.setAll(chart.series.values);

  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  cursor.lineX.set("visible", false);
  cursor.lineY.set("visible", false);
  chart.appear(1000, 100);
}
export function createPieChart(root, data, themeKey) {
  applyThemes(root, getThemeFactory(themeKey));

  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: am5.VerticalLayout.new(root, {}),
      innerRadius: am5.percent(50),
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

  // ✅ NO FILL ADAPTER NEEDED
  series.data.setAll(data);

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


export function createScatterChart(root, data, themeKey) {
  applyThemes(root, getThemeFactory(themeKey));

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomXY",
    })
  );

  chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "zoomXY" }));

  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      xAxis,
      yAxis,
      valueYField: "y",
      valueXField: "x",
      tooltip: am5.Tooltip.new(root, {
        labelText: "x: {valueX}, y: {valueY}",
      }),
    })
  );

  series.strokes.template.set("visible", false);

  series.bullets.push(() =>
    am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
      }),
    })
  );

  series.data.setAll(data);
  chart.appear(1000, 100);
}

export function createHistogramChart(root, data, themeKey) {
  applyThemes(root, getThemeFactory(themeKey));

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      min: 0,
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      openValueXField: "start",
      valueXField: "end",
      tooltip: am5.Tooltip.new(root, {
        labelText:
          "Range: {openValueX.formatNumber('#.##')} - {valueX.formatNumber('#.##')}\nFrequency: {valueY}",
      }),
    })
  );
  chart.set("cursor", am5xy.XYCursor.new(root, { snapToSeries: [series] }));

  series.columns.template.setAll({
    stroke: root.interfaceColors.get("background"),
    strokeWidth: 2,
    strokeOpacity: 1,
    width: am5.p100,
    cornerRadiusTL: 0,
    cornerRadiusTR: 0,
  });

  series.data.setAll(data);
  chart.appear(1000, 100);
}