/*
 * wallop - A minimal JS library for showing & hiding things
 * http://pedroduarte.me/wallop
 *
 * by Pedro Duarte
 */

if (document.getElementById('slider')) {
    var Wallop = require('wallop'),
    wallopEl = document.getElementById('slider'),
    slider = new Wallop(wallopEl, {
      itemClass: 'slider_item',
      currentItemClass: 'slider_item--current',
      showPreviousClass: 'slider_item--show-previous',
      showNextClass: 'slider_item--show-next',
      hidePreviousClass: 'slider_item--hide-previous',
      hideNextClass: 'slider_item--hide-next',
    });
    var autoPlayMs = 4500,
    nextTimeout,
    loadNext = function() {
      var nextIndex = (slider.currentItemIndex + 1) % slider.allItemsArray.length;
      slider.goTo(nextIndex);
    };
    nextTimeout = setTimeout(function() { loadNext(); }, autoPlayMs);
    slider.on('change', function() {
      clearTimeout(nextTimeout);
      nextTimeout = setTimeout(function() { loadNext(); }, autoPlayMs);
    });

    wallopEl.addEventListener('mouseenter', function() {
      clearTimeout(nextTimeout);
    });
    wallopEl.addEventListener('mouseleave', function() {
      nextTimeout = setTimeout(function() { loadNext(); }, autoPlayMs);
    });
}
