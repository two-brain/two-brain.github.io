/*
 * Waypoints - Waypoints is a library that makes it easy to execute a function whenever you scroll to an element
 * https://github.com/imakewebthings/waypoints
 *
 * by Caleb Troughton
 */

//
require('waypoints/lib/noframework.waypoints.js');

var body = document.body || document.documentElement,
    toTop = document.getElementById('js-beam-me-up'),
    backToTop = new Waypoint({
      element: body,
      handler: function(direction) {
        toTop.classList.toggle('is-visible');

        // if (direction === 'down') {
        //
        // } else {
        //
        // }
        
      },
      offset: '-70%'
    });
