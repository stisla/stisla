/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";

(function(fn) {
  if ((typeof(Turbolinks) !== 'undefined') && (Turbolinks)) {
    document.addEventListener('turbolinks:load', fn)
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
})(function() {

/**
 *
 * You can write your JS code here
 * 
 */  

});