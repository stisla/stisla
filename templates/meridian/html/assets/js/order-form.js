// Order form line-items editor for the dashboard.
//
// Adds/removes line rows and keeps the running totals (subtotal, 10% tax,
// shipping, grand total) in sync as quantities and prices change. All
// client-side so the starter form is interactive with no backend. Mirrors the
// totals into the sticky save bar. No-op on pages without [data-order-form].

(function () {
  var form = document.querySelector('[data-order-form]');
  if (!form) return;

  var body = form.querySelector('[data-line-items]');
  var template = document.querySelector('[data-line-template]');
  var addBtn = form.querySelector('[data-add-item]');
  var shippingEl = form.querySelector('[data-shipping]');
  var TAX_RATE = 0.1;

  function money(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function num(el) {
    var v = parseFloat(el && el.value);
    return isNaN(v) ? 0 : v;
  }

  // Update every element matching the selector — there are two [data-total]
  // nodes (totals list + save bar), and they should always agree.
  function setText(selector, value) {
    form.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  function recalc() {
    var subtotal = 0;
    body.querySelectorAll('[data-line-row]').forEach(function (row) {
      var lineTotal = num(row.querySelector('[data-qty]')) * num(row.querySelector('[data-price]'));
      subtotal += lineTotal;
      row.querySelector('[data-line-total]').textContent = money(lineTotal);
    });

    var tax = subtotal * TAX_RATE;
    var shipping = num(shippingEl);
    setText('[data-subtotal]', money(subtotal));
    setText('[data-tax]', money(tax));
    setText('[data-total]', money(subtotal + tax + shipping));
  }

  addBtn.addEventListener('click', function () {
    body.appendChild(template.content.firstElementChild.cloneNode(true));
    recalc();
  });

  body.addEventListener('input', function (event) {
    if (event.target.matches('[data-qty], [data-price]')) recalc();
  });

  body.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-remove-item]');
    if (!btn) return;
    var rows = body.querySelectorAll('[data-line-row]');
    if (rows.length <= 1) {
      // Keep at least one row — clear it instead of leaving an empty table.
      var row = btn.closest('[data-line-row]');
      row.querySelector('input[type="text"]').value = '';
      row.querySelector('[data-qty]').value = '1';
      row.querySelector('[data-price]').value = '0.00';
    } else {
      btn.closest('[data-line-row]').remove();
    }
    recalc();
  });

  if (shippingEl) shippingEl.addEventListener('input', recalc);

  // Demo form: no backend, so don't navigate away on submit.
  form.addEventListener('submit', function (event) {
    event.preventDefault();
  });

  recalc();
})();
