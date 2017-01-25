/*
 * bLazy -  A lightweight pure JavaScript script for lazy loading and multi-serving images.
 * https://github.com/dinbror/blazy
 *
 * by dinbror
 */

var Blazy = require('blazy');
var lazyload = new Blazy({
  selector: '.lazy',
  successClass: 'lazy--has-loaded',
  errorClass: 'lazy--has-error',
  success: function(element) {
    setTimeout(function() {
      var parent = element.parentNode;
      parent.className = parent.className.replace(/\bloading\b/, 'loaded');
    }, 200);
  },
  error: function(ele, msg) {
    if (msg === 'missing') {
      console.log('data-src is missing');
    } else if (msg === 'invalid') {
      console.log('data-src is invalid');
    }
  },
});
