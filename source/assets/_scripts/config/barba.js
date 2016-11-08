/*
 * Barba.js - Create badass, fluid and smooth transition between your website's pages
 * https://github.com/luruke/barba.js
 *
 * by Luigi De Rosa
 */

 // var lazyload = require('./blazy.js');
 // var Wallop = require('./wallop.js');


var Barba = require('barba.js');
// var Velocity = require('velocity-animate');

Barba.Pjax.start();
Barba.Prefetch.init();

// var FadeTransition = Barba.BaseTransition.extend({
//   start: function() {
//     /**
//      * This function is automatically called as soon the Transition starts
//      * this.newContainerLoading is a Promise for the loading of the new container
//      * (Barba.js also comes with an handy Promise polyfill!)
//      */
//
//     // As soon the loading is finished and the old page is faded out, let's fade the new page
//     Promise
//       .all([this.newContainerLoading, this.fadeOut()])
//       .then(this.fadeIn.bind(this));
//   },
//
//   fadeOut: function() {
//     /**
//      * this.oldContainer is the HTMLElement of the old Container
//      */
//
//      Velocity(this.oldContainer, { opacity: 0 }, { display: "none" });
//     //  Velocity(this.oldContainer, { opacity: 0 });
//   },
//
//   fadeIn: function() {
//     /**
//      * this.newContainer is the HTMLElement of the new Container
//      * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
//      * Please note, newContainer is available just after newContainerLoading is resolved!
//      */
//
//
//
//     var _this = this;
//     // var $el = $(this.newContainer);
//     //
//     this.newContainer.setAttribute('style','visibility: visible');
//
//     var body = document.body || document.documentElement,
//         active = body.classList.contains('js-overlay--is-expanded'),
//         overlay = document.getElementById('js-overlay');
//
//     body.classList.toggle('js-overlay--is-expanded');
//
//     Velocity(overlay, 'slideUp', {
//       delay: 500,
//       duration: 750,
//       easing: 'ease',
//       complete: function() {
//
//         var lang = document.getElementById('js-lang'),
//             nav = document.getElementById('js-nav');
//
//         Velocity(lang, {opacity: 0});
//
//         Velocity(nav, {opacity: 0});
//
//         lazyload.revalidate();
//
//         // (function() {
//         //   Wallop.reset();
//         //
//         // })();
//
//         // _this.done();
//       }
//     });
//   }
// });
//
// /**
//  * Next step, you have to tell Barba to use the new Transition
//  */
//
// Barba.Pjax.getTransition = function() {
//   /**
//    * Here you can use your own logic!
//    * For example you can use different Transition based on the current page or link...
//    */
//
//   return FadeTransition;
// };
