"use strict";

// initialize map
var map = new GMaps({
  div: '#map',
  lat: -6.8665409,
  lng: 106.4836553,
  zoom: 8
});
// Added markers to the map
map.addMarker({
  lat: -6.5637928,
  lng: 106.7535061,
  title: 'Multinity',
  infoWindow: {
    content: '<h6>Multinity</h6><p>Jl. HM. Syarifudin, Bubulak, Bogor Bar., <br>Kota Bogor, Jawa Barat 16115</p><p><a target="_blank" href="https://multinity.com">Website</a></p>'
  }
});
map.addMarker({
  lat: -6.1325841,
  lng: 106.8116507,
  title: 'Procyon Logikreasi Indonesia',
  infoWindow: {
    content: '<h6>Procyon Logikreasi Indonesia</h6><p>Jl. Kali Besar Tim. No.29C, RT.7/RW.7, Pinangsia, Tamansari, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11110</p><p><a target="_blank" href="https://procyon.co.id/">Website</a></p>'
  }
});
map.addMarker({
  lat: -6.4462693,
  lng: 106.7654318,
  title: 'Sigma ID',
  infoWindow: {
    content: '<h6>Sigma ID</h6><p>Jl.Setapak No.5, Citayam, Tajur Halang, Bogor, Jawa Barat 16320</p><p><a target="_blank" href="http://sigmaid.net/">Website</a></p>'
  }
});
