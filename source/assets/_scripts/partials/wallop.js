/*
 * wallop - A minimal JS library for showing & hiding things
 * http://pedroduarte.me/wallop
 *
 * by Pedro Duarte
 */

import Wallop from 'wallop';

export default function wallopSlider() {
  if (document.getElementById('slider')) {
    const wallopEl = document.getElementById('slider');
    const slider = new Wallop(wallopEl, {
      itemClass: 'slider_item',
      currentItemClass: 'slider_item--current',
      showPreviousClass: 'slider_item--show-previous',
      showNextClass: 'slider_item--show-next',
      hidePreviousClass: 'slider_item--hide-previous',
      hideNextClass: 'slider_item--hide-next',
    });
    const autoPlayMs = 4500;
    const loadNext = function() {
      const nextIndex =
      (slider.currentItemIndex + 1) % slider.allItemsArray.length;
      slider.goTo(nextIndex);
    };
    let nextTimeout;
    nextTimeout = setTimeout(function() {
      loadNext();
    }, autoPlayMs);
    slider.on('change', function() {
      clearTimeout(nextTimeout);
      nextTimeout = setTimeout(function() {
        loadNext();
      }, autoPlayMs);
    });

    wallopEl.addEventListener('mouseenter', function() {
      clearTimeout(nextTimeout);
    });
    wallopEl.addEventListener('mouseleave', function() {
      nextTimeout = setTimeout(function() {
        loadNext();
      }, autoPlayMs);
    });
  }
}
