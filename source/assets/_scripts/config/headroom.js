/*
 * Headroom.js - Give your pages some headroom. Hide your header until you need it
 * https://github.com/WickyNilliams/headroom.js
 *
 * by Nick Williams
 */

 var Headroom = require('headroom.js'),
 header = document.getElementById('site-header'),
 headroom  = new Headroom(header, {
   offset: 250,
   tolerance: 5,
 });
 headroom.init();
