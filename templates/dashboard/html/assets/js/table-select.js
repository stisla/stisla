// Table row selection — the one table interaction that survives server
// rendering: tick rows, reveal the bulk-action bar, and keep the select-all box
// and the selected count in sync. No dependency and no data layer; it operates
// on whatever rows the server rendered.
//
// Hooks, scoped to each [data-table-select] container:
//   [data-select-all]   header checkbox — toggles every row checkbox on the page
//   [data-select-row]   per-row checkbox
//   [data-bulkbar]      bar shown only while at least one row is selected
// Document-wide:
//   [data-select-count] selected-count text (bulk bar + any confirm dialog)
//   tr[data-state="active"] is set on selected rows for the table highlight tier
//
// Plus the generic dialog-fill helper: a [data-stisla-dialog-trigger] carrying
// data-fill-<slot>="value" drops that value into [data-slot="<slot>"] inside the
// dialog it opens, so a row action can name its row in the confirm copy.

(function () {
  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  function setup(root) {
    var selectAll = root.querySelector('[data-select-all]');
    var bulkbar = root.querySelector('[data-bulkbar]');

    function rows() {
      return root.querySelectorAll('[data-select-row]');
    }

    function sync() {
      var boxes = rows();
      var checked = 0;
      each(boxes, function (box) {
        var tr = box.closest('tr');
        if (box.checked) {
          checked++;
          if (tr) tr.setAttribute('data-state', 'active');
        } else if (tr) {
          tr.removeAttribute('data-state');
        }
      });

      each(document.querySelectorAll('[data-select-count]'), function (el) {
        el.textContent = checked;
      });

      if (bulkbar) bulkbar.hidden = checked === 0;

      if (selectAll) {
        selectAll.checked = boxes.length > 0 && checked === boxes.length;
        selectAll.indeterminate = checked > 0 && checked < boxes.length;
      }
    }

    if (selectAll) {
      selectAll.addEventListener('change', function () {
        each(rows(), function (box) {
          box.checked = selectAll.checked;
        });
        sync();
      });
    }

    root.addEventListener('change', function (event) {
      if (event.target.matches('[data-select-row]')) sync();
    });

    sync();
  }

  each(document.querySelectorAll('[data-table-select]'), setup);

  // Generic dialog-fill (page-wide, attached once).
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-stisla-dialog-trigger]');
    if (!trigger) return;
    var dialog = document.getElementById(trigger.getAttribute('data-stisla-dialog-trigger'));
    if (!dialog) return;
    each(trigger.attributes, function (attr) {
      if (attr.name.indexOf('data-fill-') !== 0) return;
      var slot = dialog.querySelector('[data-slot="' + attr.name.slice(10) + '"]');
      if (slot) slot.textContent = attr.value;
    });
  });
})();
