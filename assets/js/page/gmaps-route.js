"use strict";

// initialize map
var map = new GMaps({
  div: '#map',
  lat: -6.5637928,
  lng: 106.7535061,
  zoom: 13
});

// draw route between 'origin' to 'destination'
map.drawRoute({
  origin: [-6.5637928, 106.7535061],
  destination: [-6.5956157, 106.788236],
  travelMode: 'driving',
  strokeColor: '#131540',
  strokeOpacity: 0.6,
  strokeWeight: 6
});