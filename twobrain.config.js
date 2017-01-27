var secrets      = require('./secrets.json');

module.exports = {
  port: 4000,

  tasks: {
    imagemin:   true,
    sass:       true,
    server:     true,
    webpack:    true,
  },

  paths: {
    dest:      'build',
    posts:     'source/_posts',
    assets:    'source/assets',
    css:       'styles',
    js:        'scripts',
    images:    'images',
    sass:      '_styles',
    jsSrc:     '_scripts',
    imagesSrc: '_images',
    includes:  'source/_includes',
  },

  jekyll: {
    config: {
      default: '_config.yml',
      development: '_config.dev.yml',
      production: '_config.prod.yml',
    },
  },

  sass: {
    outputStyle: 'compressed',
  },

  autoprefixer: {
    browsers: [
      'last 2 versions',
      'android 4',
      'opera 12',
    ],
  },

  pxtorem: {
    options: {
      selectorBlackList: [
        'html',
      ],
      prop_white_list: [
        'font-size',
      ],
      rootValue: 18,
      replace: false,
    },
  },

  js: {
    entry: [
      'main.js',
    ],
  },

  htmlmin: {
    options: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      collapseBooleanAttributes: true,
    },
  },

  rsync: {
    options: {
      destination: '~/html/',
      root: 'build',
      hostname: secrets.host,
      username: secrets.user,
      incremental: true,
      recursive: true,
      progress: true,
    },
  },
};
