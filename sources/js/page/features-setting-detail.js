"use strict";

$("#setting-form").submit(function() {
  let save_button = $(this).find('#save-btn'),
    output_status = $("#output-status"),
    card = $('#settings-card');

  let card_progress = $.cardProgress(card, {
    spinner: false
  });
  save_button.addClass('btn-progress');
  output_status.html('');
  
  // Do AJAX here
  // Here's fake AJAX
  setTimeout(function() {
    card_progress.dismiss(function() {
      $('html, body').animate({
        scrollTop: 0
      });

      output_status.prepend('<div class="alert alert-success">Setting saved Successfully.</div>')
      save_button.removeClass('btn-progress');      
    });
  }, 3000);
  return false;
});