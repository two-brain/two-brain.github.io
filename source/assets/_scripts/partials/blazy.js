/*
 * bLazy -  A lightweight pure JavaScript script
 * for lazy loading and multi-serving images.
 *
 * https://github.com/dinbror/blazy
 *
 * by dinbror
 */

export default function lazyImages() {
  const Blazy = require('blazy');
  const lazyload = new Blazy({
    offset: 0,
    selector: '.lazy',
    successClass: 'lazy--has-loaded',
    errorClass: 'lazy--has-error',
    success: function(element) {
      setTimeout(function() {
        let parent = element.parentNode;
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
}
