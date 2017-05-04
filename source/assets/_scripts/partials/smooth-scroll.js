/*
 * Smooth Scroll - A lightweight script to animate scrolling to anchor links.
 * https://github.com/cferdinandi/smooth-scroll
 *
 * by Chris Ferdinandi
 */

import smoothScroll from 'smooth-scroll';

export default function smoothScrollJS() {
  smoothScroll.init({
    activeClass: 'is-active',
  });
}
