"use strict";

// initialize map
var map = new GMaps({
  div: '#map',
  lat: -6.5637928,
  lng: 106.7535061
});
// Added a marker to the map
map.addMarker({
  lat: -6.5637928,
  lng: 106.7535061,
  title: 'Multinity',
  infoWindow: {
    content: '<h6>Multinity</h6><p>Jl. HM. Syarifudin, Bubulak, Bogor Bar., <br>Kota Bogor, Jawa Barat 16115</p><p><a target="_blank" href="http://multinity.com">Website</a></p>'
  }
});
