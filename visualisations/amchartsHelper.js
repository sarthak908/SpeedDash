//for bar chart
export function createBarChart(root, data) {
  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );

  // --- NEW: Create Cursor ---
  const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  //   cursor.lineY.set("visible", false);

  // Create Axes
  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
      // --- NEW: Add Axis Tooltip ---
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, { renderer: am5xy.AxisRendererY.new(root, {}) })
  );

  // Create Series
  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis,
      yAxis,
      valueYField: "value",
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{categoryX}: [bold]{valueY}[/]",
      }),
    })
  );
  series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
  series.columns.template.adapters.add("fill", (fill, target) =>
    chart.get("colors").getIndex(series.columns.indexOf(target))
  );

  // --- NEW: Add Hover State ---
  series.columns.template.states.create("hover", {
    fillOpacity: 0.7,
    scale: 1.05,
  });

  // --- NEW: Add Scrollbar ---
  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, { orientation: "horizontal" })
  );

  // Set Data
  xAxis.data.setAll(data);
  series.data.setAll(data);
  series.appear(500);
  chart.appear(500, 100);
}

export function createLineChart(root, data) {
  // Create chart
  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
    })
  );
  chart.set(
    "scrollbarX",
    am5.Scrollbar.new(root, {
      orientation: "horizontal",
    })
  );
  // Create X Axis
  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
      tooltip: am5.Tooltip.new(root, {}),
    })
  );

  // Create Y Axis
  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  // Add Cursor
  const cursor = chart.set(
    "cursor",
    am5xy.XYCursor.new(root, {
      behavior: "zoomX",
      xAxis: xAxis,
    })
  );
  //   cursor.lineY.set("visible", false);

  // Create Line Series
  const series = chart.series.push(
    am5xy.LineSeries.new(root, {
      name: "Series", // For Legend
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "[bold]{name}[/]\n{categoryX}: {valueY}",
      }),
    })
  );

  // Add bullets with hover effect
  series.bullets.push(function () {
    const circle = am5.Circle.new(root, {
      radius: 5,
      fill: series.get("fill"),
      stroke: root.interfaceColors.get("background"),
      strokeWidth: 2,
    });

    circle.states.create("hover", { scale: 1.5 });

    return am5.Bullet.new(root, {
      sprite: circle,
    });
  });

  // Add Legend
  const legend = chart.children.push(
    am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      marginTop: 15,
    })
  );
  legend.data.setAll(chart.series.values);

  // Set data
  xAxis.data.setAll(data);
  series.data.setAll(data);

  // Animate series and chart
  series.appear(1000);
  chart.appear(1000, 100);
}

export function createPieChart(root, data) {
  const chart = root.container.children.push(
    am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(50),
    })
  );

  // Create Series
  const series = chart.series.push(
    am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: true, // --- NEW: Better label alignment
    })
  );

  series.slices.template.setAll({
    tooltipText:
      "{category}: [bold]{value} ({valuePercentTotal.formatNumber('0.0')}%)[/]",
    toggleKey: "active",
  });

  // --- NEW: Add Hover State ---
  series.slices.template.states.create("hover", {
    scale: 1.05,
  });

  // --- NEW: Improved Labels & Ticks ---
  series.labels.template.setAll({
    radius: 10,
    text: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
  });
  series.ticks.template.setAll({
    forceHidden: false,
  });

  // Set Data
  series.data.setAll(data);

  // --- NEW: Add Centered Total Label ---
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const totalLabel = am5.Label.new(root, {
    text: `Total\n[bold]${total.toLocaleString()}[/]`,
    fontSize: 20,
    textAlign: "center",
    centerX: am5.p50,
    centerY: am5.p50,
  });
  chart.seriesContainer.children.push(totalLabel);

  // Create Legend
  const legend = chart.children.push(
    am5.Legend.new(root, { centerX: am5.p50, x: am5.p50, marginTop: 15 })
  );
  legend.data.setAll(series.dataItems);

  // Animate
  series.appear(1000, 100);
}
