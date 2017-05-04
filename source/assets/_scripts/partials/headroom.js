/*
 * Headroom.js - Give your pages some headroom.
 * Hide your header until you need it
 *
 * https://github.com/WickyNilliams/headroom.js
 *
 * by Nick Williams
 */

import Headroom from 'headroom.js';

export default function headroomJS() {
  const header = document.getElementById('site-header');
  const headroom = new Headroom(header, {
    'offset': 150,
    'tolerance': 25,
    'classes': {
      'initial': 'animated',
      'pinned': 'slideDown',
      'unpinned': 'slideUp',
    },
  });
  headroom.init();
}
