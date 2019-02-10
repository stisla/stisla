"use strict";

// initialize map
var map = new GMaps({
  div: '#map',
  lat: -6.5637928,
  lng: 106.7535061
});

// when the 'start travel' button is clicked
$("#start-travel").click(function() {
  $(this).fadeOut();
  $("#instructions").before("<div class='section-title'>Instructions</div>");
  map.travelRoute({
    origin: [-6.5637928, 106.7535061],
    destination: [-6.5956157, 106.788236],
    travelMode: 'driving',
    step: function(e) {
      $('#instructions').append('<li class="media"><div class="media-icon"><i class="far fa-circle"></i></div><div class="media-body">'+e.instructions+'</div></li>');
      $('#instructions li:eq(' + e.step_number + ')').delay(450 * e.step_number).fadeIn(200, function() {
        map.setCenter(e.end_location.lat(), e.end_location.lng());
        map.drawPolyline({
          path: e.path,
          strokeColor: '#131540',
          strokeOpacity: 0.6,
          strokeWeight: 6
        });
      });
    }
  });
});
