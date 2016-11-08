/*
 * Velocity - Accelerated JavaScript animation
 * https://github.com/julianshapiro/velocity
 *
 * by Julian Shapiro
 */

var Velocity = require('velocity-animate');

window.onload = function() {

  var theParent = document.getElementById('js-nav-toggle');

  theParent.addEventListener('click', function(e) {

      // if (e.target !== e.currentTarget) {

        var body = document.body || document.documentElement,
            active = body.classList.contains('js-overlay--is-expanded'),
            overlay = document.getElementById('js-overlay');

        body.classList.toggle('js-overlay--is-expanded');

        // if (e.target.tagName === 'A') {
        //   // window.scrollTo(0, 0);
        //   document.body.scrollTop = 0;
        // }

        Velocity(overlay, active ? 'slideUp' : 'slideDown', {
          // delay: 150,
          duration: 750,
          easing: 'ease',
          complete: function() {

            var lang = document.getElementById('js-lang'),
                nav = document.getElementById('js-nav');

            Velocity(nav, active ? {opacity: 0} : {opacity: 1}, {
              duration: 250,
            });

            Velocity(lang, active ? {opacity: 0} : {opacity: 1}, {
              delay: 250,
              duration: 250,
            });
          }
        });

        e.preventDefault();

      // }
  }, false);
};
