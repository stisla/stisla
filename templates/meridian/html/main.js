// Meridian dev entry. app.css is the Tailwind compile unit: framework theme + components (from
// @stisla/style source) + template styles (dashboard.css) + the Tailwind utilities the markup
// uses, generated from the @source scan. @stisla/vanilla is the behavior
// layer (auto-inits on load). The four template scripts are each guarded (no-op when their
// elements are absent), so one entry serves the dashboard, auth, and error layouts alike.
// ApexCharts loads from the CDN in the layout.
import "./assets/css/app.css";
import "@stisla/vanilla";

import "./assets/js/app-shell.js";
import "./assets/js/theme.js";
import "./assets/js/charts.js";
import "./assets/js/order-form.js";
import "./assets/js/table-select.js";
