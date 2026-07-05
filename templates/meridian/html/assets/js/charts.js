// Sales performance chart + Balance/Sales hero sparklines for the dashboard.
//
// ApexCharts is loaded from the CDN. Every chart reads Stisla's runtime --color-*
// tokens so its colors match the active theme, and re-themes when the topbar
// toggle fires `stisla:themechange`. No-op on pages without these elements.

(function () {
  if (!window.ApexCharts) return;

  var root = document.documentElement;

  function token(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function mode() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  // Pair each live chart with the factory that rebuilds its options, so a theme
  // toggle can re-resolve the tokens and push them back in.
  var live = [];

  function build(el, factory) {
    // ApexCharts resolves a "100%" height against the target's PARENT, not the
    // target itself. The .chart box carries --chart-height, so mount into a
    // child of it — otherwise the percentage resolves against .card__body (no
    // fixed height) and the SVG overflows onto the siblings below it.
    var inner = document.createElement("div");
    el.appendChild(inner);
    var chart = new ApexCharts(inner, factory());
    chart.render();
    return { inner: inner, chart: chart };
  }

  function mount(el, factory, opts) {
    if (!el) return;
    var built = build(el, factory);
    live.push({
      el: el,
      inner: built.inner,
      chart: built.chart,
      factory: factory,
      // ApexCharts does not re-apply a heatmap's colorScale on updateOptions —
      // the cells go black on a theme toggle (either direction). Rebuild from
      // scratch instead so the new tokens actually take.
      rebuild: !!(opts && opts.rebuild),
    });
  }

  // Sales performance — actuals vs budget, full area chart.
  function salesOptions() {
    var primary = token("--color-primary");
    var danger = token("--color-danger");
    var muted = token("--color-muted-foreground");
    var border = token("--color-border");

    return {
      chart: {
        type: "area",
        // Container owns the height (see .chart in dashboard.scss); fill it.
        height: "100%",
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
      },
      theme: { mode: mode() },
      colors: [primary, danger],
      series: [
        {
          name: "Sales",
          data: [3000, 1800, 3200, 4500, 3000, 6000, 5500, 5800],
        },
        {
          name: "Budget",
          data: [2400, 1400, 2600, 3600, 2400, 4800, 4600, 4900],
        },
      ],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        axisBorder: { color: border },
        axisTicks: { color: border },
        labels: { style: { colors: muted } },
      },
      yaxis: {
        // Headroom above the 6k peak so the smooth-curve overshoot isn't
        // clipped at the top of the plot area.
        min: 1000,
        max: 7000,
        tickAmount: 6,
        labels: {
          style: { colors: muted },
          formatter: function (value) {
            return "$" + (value / 1000).toFixed(1) + "k";
          },
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          // Pin the end colors so ApexCharts doesn't auto-shade the series
          // color toward gray — its shade math can't parse our oklch() tokens.
          // Same color top and bottom; only the opacity fades.
          gradientToColors: [primary, danger],
          inverseColors: false,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      grid: { borderColor: border, strokeDashArray: 4 },
      legend: { show: false },
      tooltip: {
        y: {
          formatter: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    };
  }

  // Hero sparklines — full-bleed micro area charts pinned to the stat-card top.
  // sparkline mode strips the axes, grid and padding so the fill runs edge to
  // edge under the figure.
  function heroOptions(hero) {
    var color = token(hero.color || "--color-primary");
    return {
      chart: {
        type: "area",
        height: 88,
        sparkline: { enabled: true },
        background: "transparent",
      },
      theme: { mode: mode() },
      colors: [color],
      series: [{ name: hero.name, data: hero.data }],
      stroke: { curve: "smooth", width: 2 },
      fill: {
        type: "gradient",
        gradient: {
          // See salesOptions: pin the end color so the fade stays on the token
          // hue instead of ApexCharts shading our oklch() color to gray.
          gradientToColors: [color],
          inverseColors: false,
          opacityFrom: 0.35,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      tooltip: {
        y: {
          formatter: hero.tip,
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    };
  }

  // ---- Reports page ---------------------------------------------------------

  // Revenue over time — grouped columns comparing this period vs last.
  function revenueOptions() {
    var primary = token("--color-primary");
    var info = token("--color-info");
    var muted = token("--color-muted-foreground");
    var border = token("--color-border");

    return {
      chart: {
        type: "bar",
        height: "100%",
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        background: "transparent",
      },
      theme: { mode: mode() },
      colors: [primary, info],
      series: [
        {
          name: "This period",
          data: [28000, 31000, 29500, 36000, 42000, 39000, 45000, 48210],
        },
        {
          name: "Last period",
          data: [24000, 26000, 30000, 31000, 35000, 37000, 40000, 43000],
        },
      ],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        axisBorder: { color: border },
        axisTicks: { color: border },
        labels: { style: { colors: muted } },
      },
      yaxis: {
        labels: {
          style: { colors: muted },
          formatter: function (value) {
            return "$" + (value / 1000).toFixed(0) + "k";
          },
        },
      },
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          columnWidth: "65%",
          borderRadius: 4,
          borderRadiusApplication: "end",
        },
      },
      // ApexCharts has no intra-group bar gap, so carve one with a transparent
      // stroke around each bar: the card surface shows through between the
      // paired bars. Theme-proof since it reveals whatever's behind.
      stroke: { show: true, width: 6, colors: ["transparent"] },
      grid: { borderColor: border, strokeDashArray: 4 },
      legend: { show: true, position: "top", horizontalAlign: "right" },
      tooltip: {
        y: {
          formatter: function (value) {
            return "$" + value.toLocaleString();
          },
        },
      },
    };
  }

  // Donut factory shared by the category + channel breakdowns. Slices read
  // values as percentages.
  function donutOptions(labels, series, colorTokens) {
    var colors = colorTokens.map(function (name) {
      return token(name);
    });
    return {
      chart: {
        type: "donut",
        height: "100%",
        fontFamily: "inherit",
        background: "transparent",
      },
      theme: { mode: mode() },
      labels: labels,
      series: series,
      colors: colors,
      stroke: { width: 0 },
      legend: { position: "bottom" },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + "%";
        },
      },
      plotOptions: { pie: { donut: { size: "68%" } } },
      tooltip: {
        y: {
          formatter: function (value) {
            return value + "%";
          },
        },
      },
    };
  }

  function categoryOptions() {
    return donutOptions(
      ["Coffee", "Equipment", "Supplies", "Gifts"],
      [44, 30, 16, 10],
      ["--color-primary", "--color-info", "--color-success", "--color-warning"],
    );
  }

  function channelOptions() {
    return donutOptions(
      ["Online", "Retail", "Wholesale"],
      [62, 24, 14],
      ["--color-primary", "--color-info", "--color-success"],
    );
  }

  // Top products — horizontal bar.
  function topProductsOptions() {
    var primary = token("--color-primary");
    var muted = token("--color-muted-foreground");
    var border = token("--color-border");

    return {
      chart: {
        type: "bar",
        height: "100%",
        fontFamily: "inherit",
        toolbar: { show: false },
        background: "transparent",
      },
      theme: { mode: mode() },
      colors: [primary],
      series: [{ name: "Units sold", data: [320, 280, 210, 180, 140] }],
      xaxis: {
        categories: [
          "Espresso Beans",
          "Travel Mug",
          "Cold Brew",
          "Pour-Over",
          "Gift Box",
        ],
        axisBorder: { color: border },
        axisTicks: { color: border },
        labels: { style: { colors: muted } },
      },
      yaxis: { labels: { style: { colors: muted } } },
      plotOptions: {
        bar: { horizontal: true, borderRadius: 4, barHeight: "60%" },
      },
      dataLabels: { enabled: false },
      grid: { borderColor: border, strokeDashArray: 4 },
    };
  }

  // Fulfillment — on-time rate radial gauge for the insight row.
  function fulfillmentOptions() {
    var primary = token("--color-primary");
    var muted = token("--color-muted-foreground");
    var foreground = token("--color-foreground");
    var track = token("--color-neutral");

    return {
      chart: {
        type: "radialBar",
        height: "100%",
        fontFamily: "inherit",
        background: "transparent",
      },
      theme: { mode: mode() },
      colors: [primary],
      series: [94],
      labels: ["On-time"],
      plotOptions: {
        radialBar: {
          hollow: { size: "62%" },
          track: { background: track, strokeWidth: "100%" },
          dataLabels: {
            name: {
              offsetY: 22,
              color: muted,
              fontSize: "11px",
              fontWeight: 500,
            },
            value: {
              offsetY: -18,
              color: foreground,
              fontSize: "28px",
              fontWeight: 300,
              formatter: function (value) {
                return value + "%";
              },
            },
          },
        },
      },
      stroke: { lineCap: "round" },
    };
  }

  // Order heatmap — weekday × hour-band density. ApexCharts stacks series
  // bottom-to-top, so the hour rows are listed latest-first to put 00 on top.
  function heatmapOptions() {
    var primary = token("--color-primary");
    var muted = token("--color-muted-foreground");
    var surface = token("--color-surface");
    var days = ["M", "T", "W", "T", "F", "S", "S"];

    // Build the less->more scale by blending primary toward the card surface in
    // oklch space, t = how much primary. We emit OPAQUE colours rather than a
    // translucent primary: an alpha fill composites over the surface, so on the
    // dark theme (surface ~oklch(0.18)) the low steps collapse into the
    // background and the whole grid goes invisible. Blending bakes the surface
    // in, so each step stays legible in both themes and recomputes on toggle.
    // (ApexCharts' own shade math can't parse oklch — falls back to grey, see
    // salesOptions — so we hand it ready-made strings via colorScale.ranges.)
    function nums(c) {
      if (!/^oklch\(/.test(c)) return null;
      var m = c.match(/-?\d*\.?\d+/g);
      return m && m.length >= 3 ? m.map(parseFloat) : null;
    }
    function mix(t) {
      var p = nums(primary);
      var s = nums(surface);
      // Fallback to a translucent step if a token isn't plain oklch(L C H).
      if (!p || !s) return primary.replace(/\)$/, " / " + t + ")");
      var l = s[0] + (p[0] - s[0]) * t;
      var c = s[1] + (p[1] - s[1]) * t;
      return "oklch(" + l.toFixed(4) + " " + c.toFixed(4) + " " + p[2] + ")";
    }
    function row(name, vals) {
      return {
        name: name,
        data: days.map(function (d, i) {
          return { x: d, y: vals[i] };
        }),
      };
    }

    return {
      chart: {
        type: "heatmap",
        height: "100%",
        fontFamily: "inherit",
        toolbar: { show: false },
        background: "transparent",
      },
      theme: { mode: mode() },
      series: [
        row("23", [10, 18, 14, 22, 30, 26, 12]),
        row("18", [28, 40, 46, 52, 88, 64, 30]),
        row("12", [44, 52, 60, 56, 72, 80, 50]),
        row("06", [18, 26, 30, 24, 38, 34, 16]),
        row("00", [6, 10, 8, 14, 20, 16, 8]),
      ],
      dataLabels: { enabled: false },
      plotOptions: {
        heatmap: {
          radius: 8,
          enableShades: false,
          colorScale: {
            ranges: [
              { from: 0, to: 14, color: mix(0.2) },
              { from: 15, to: 34, color: mix(0.4) },
              { from: 35, to: 54, color: mix(0.6) },
              { from: 55, to: 74, color: mix(0.8) },
              { from: 75, to: 100, color: mix(1) },
            ],
          },
        },
      },
      xaxis: {
        type: "category",
        categories: days,
        position: "bottom",
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: muted } },
        tooltip: { enabled: false },
      },
      yaxis: { labels: { offsetX: -6, style: { colors: muted } } },
      legend: { show: false },
      // Cell borders painted in the card surface read as gaps between cells.
      stroke: { width: 5, colors: [surface] },
      grid: { padding: { left: 4, right: 0, top: -8, bottom: -8 } },
      tooltip: {
        y: {
          formatter: function (value) {
            return value + " orders";
          },
        },
      },
    };
  }

  mount(document.querySelector("#salesChart"), salesOptions);
  mount(document.querySelector("#fulfillmentChart"), fulfillmentOptions);
  mount(document.querySelector("#heatmapChart"), heatmapOptions, {
    rebuild: true,
  });
  mount(document.querySelector("#revenueChart"), revenueOptions);
  mount(document.querySelector("#categoryChart"), categoryOptions);
  mount(document.querySelector("#topProductsChart"), topProductsOptions);
  mount(document.querySelector("#channelChart"), channelOptions);

  [
    {
      id: "sparkBalance",
      name: "Balance",
      color: "--color-primary",
      data: [120, 134, 126, 150, 142, 166, 173, 187],
      tip: function (v) {
        return "$" + v + "k";
      },
    },
    {
      id: "sparkSales",
      name: "Units sold",
      color: "--color-success",
      data: [3600, 3900, 3400, 4200, 3800, 4500, 4400, 4732],
      tip: function (v) {
        return v.toLocaleString();
      },
    },
  ].forEach(function (hero) {
    mount(document.getElementById(hero.id), function () {
      return heroOptions(hero);
    });
  });

  window.addEventListener("stisla:themechange", function () {
    live.forEach(function (entry) {
      if (entry.rebuild) {
        entry.chart.destroy();
        entry.el.removeChild(entry.inner);
        var built = build(entry.el, entry.factory);
        entry.inner = built.inner;
        entry.chart = built.chart;
      } else {
        entry.chart.updateOptions(entry.factory());
      }
    });
  });
})();
