var body = document.body || document.documentElement;

if (body.classList.contains('fixed-header')) {

  require('parallax-vanilla');

  pv.init({
      container : {
        class : 'teaser',
        height : '100vh',
      },
      block : {
        class: 'teaser_bg-image',
        speed: 2
        // image: Url
      }
  });
}
