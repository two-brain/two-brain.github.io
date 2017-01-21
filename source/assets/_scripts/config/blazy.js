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
  // breakpoints: [
  //   {
  //     width: 480,
  //     src: 'data-src-480'
  //   }
  // ],
  success: function(element){
    setTimeout(function(){
      // We want to remove the loader gif now.
      // First we find the parent container
      // then we remove the "loading" class which holds the loader image
      var parent = element.parentNode;
      parent.className = parent.className.replace(/\bloading\b/, 'loaded');
    }, 200);
  },
  error: function(ele, msg){
    if (msg === 'missing'){
      console.log('data-src is missing');
    } else if (msg === 'invalid'){
      console.log('data-src is invalid');
    }
  }
});
