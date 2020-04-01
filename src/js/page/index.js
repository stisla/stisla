"use strict";

/**
 * Import all JS libraries
 */
import 'jquery-sparkline';

import 'chart.js';
import '../libraries/_chartjs.config';

import 'owl.carousel';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import 'owl.carousel/dist/assets/owl.theme.default.min.css';

import 'summernote';
import 'summernote/dist/summernote-bs4.css';

import 'chocolat';

import 'jqvmap/dist/jqvmap.min.css';

/**
 * Index.js
 */

var ctx = document.getElementById("budget-sales").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
    datasets: [{
      label: 'Sales',
      data: [3200, 1800, 4305, 3022, 6310, 5120, 5880, 4154],
      borderWidth: 2,
      backgroundColor: 'rgba(37,89,232,.9)',
      borderWidth: 0,
      borderColor: 'transparent',
      pointBorderWidth: 0,
      pointRadius: 8,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'rgba(37,89,232,.8)',
    },
    {
      label: 'Budget',
      data: [2207, 3403, 2200, 5025, 2302, 4208, 3880, 2880],
      borderWidth: 2,
      backgroundColor: 'rgba(255,40,83,.9)',
      borderWidth: 0,
      borderColor: 'transparent',
      pointBorderWidth: 0 ,
      pointRadius: 8,
      pointBackgroundColor: 'transparent',
      pointHoverBackgroundColor: 'rgba(254,86,83,.8)',
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        gridLines: {
          // display: false,
          drawBorder: false,
          color: '#f2f2f2',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1500,
          callback: function(value, index, values) {
            return '$' + value;
          }
        }
      }],
      xAxes: [{
        gridLines: {
          display: false,
          tickMarkLength: 15,
        }
      }]
    },
  }
});

var balance_chart = document.getElementById("balance-chart").getContext('2d');

var gradientGridlines = ctx.createLinearGradient(400, 0, 0, 0);
gradientGridlines.addColorStop(0, 'rgba(255,255,255,.2)');   
gradientGridlines.addColorStop(.7, 'rgba(255,255,255,.1)');
gradientGridlines.addColorStop(1, 'rgba(255,255,255,0)');

var myChart = new Chart(balance_chart, {
  type: 'bar',
  data: {
    labels: [35, 33, 63, 46, 68, 53, 45, 40, 55, 45, 55, 62, 75],
    datasets: [{
      label: 'Balance',
      data: [35, 33, 63, 46, 68, 53, 45, 40, 55, 45, 55, 62, 75],
      backgroundColor: 'rgba(255,222,40,1)',
      borderWidth: 3,
      borderColor: 'transparent',
      pointBorderWidth: 0,
      pointBorderColor: 'rgba(255,222,40,1)',
      pointRadius: 6,
      pointBackgroundColor: 'rgba(255,222,40,1)',
      pointHoverBackgroundColor: 'rgba(255,222,40,1)',
    }]
  },
  options: {
    layout: {
      padding: {
        bottom: 0,
        left: 0
      }
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        gridLines: {
          display: true,
          zeroLineWidth: 2,
          drawBorder: false,
          lineWidth: 2,
          color: gradientGridlines
        },
        ticks: {
          beginAtZero: true,
          display: false
        }
      }],
      xAxes: [{
        gridLines: {
          drawBorder: false,
          display: false,
        },
        ticks: {
          display: false
        }
      }]
    },
  }
});

$("#products-carousel").owlCarousel({
  items: 3,
  margin: 10,
  autoplay: true,
  autoplayTimeout: 5000,
  loop: true,
  responsive: {
    0: {
      items: 2
    },
    768: {
      items: 2
    },
    1200: {
      items: 3
    }
  }
});
