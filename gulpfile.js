'use strict';

/**
 * gulp modules
 */
var argv         = require('yargs').argv;
var autoprefixer = require('autoprefixer');
var browsersync  = require('browser-sync').create();
var del          = require('del');
var cp           = require('child_process');
var gulp         = require('gulp');
var htmlmin      = require('gulp-htmlmin');
var imagemin     = require('gulp-imagemin');
var Manifest     = require('assets-webpack-plugin');
var named        = require('vinyl-named');
var newer        = require('gulp-newer');
var jshint       = require('gulp-jshint');
var plumber      = require('gulp-plumber');
var pngquant     = require('imagemin-pngquant');
var postcss      = require('gulp-postcss');
var pxtorem      = require('postcss-pxtorem');
var sass         = require('gulp-sass');
var size         = require('gulp-size');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var watch        = require('gulp-watch');
var webpack      = require('webpack-stream');
// var webpackYO    = require('webpack');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

// Load configurations & set variables
var config       = require('./twobrain.config.js');
var tasks        = [];
var build        = [];
var paths        = {};
var entry        = [];





// Load PostCSS modules
var processors   = [
  autoprefixer({ browsers: config.autoprefixer.browsers }),
  // require('css-mqpacker')(),
  require('postcss-merge-rules'),
  pxtorem( config.pxtorem.options )
];

/**
 * Set default & build tasks
 */
Object.keys(config.tasks).forEach(function (key) {
  if (config.tasks[key]) {
    tasks.push(key === 'webpack' ? '_' + key : key);
  }
});

Object.keys(config.tasks).forEach(function (key) {
  if (config.tasks[key] && key !== 'server') {
    build.push(key);
  }
});

/**
 * Paths
 */
Object.keys(config.paths).forEach(function (key) {
  if (key !== 'assets') {
    if (config.paths.assets === '') {
      paths[key] = './' + config.paths[key];
    } else {
      paths[key] = config.paths.assets + '/' + config.paths[key];
    }
  }
});

for (var i = 0; i <= config.js.entry.length - 1; i++) {
  entry.push(paths.jsSrc + '/' + config.js.entry[i]);
}

/**
 * Clean directories before generating new assets
 */

 gulp.task('clean:styles', function() {
   del(paths.css + '/**/*');
 });

 gulp.task('clean:scripts', function() {
   del(paths.js + '/**/*');
 });

 gulp.task('clean:images', function() {
   del(paths.images + '/**/*');
 });

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
  var jekyllConfig = config.jekyll.config.default;
  if (argv.production) {
    process.env.JEKYLL_ENV = 'production';
    jekyllConfig += config.jekyll.config.production ? ',' + config.jekyll.config.production : '';
  } else {
    jekyllConfig += config.jekyll.config.development ? ',' + config.jekyll.config.development : '';
  }
  return cp.spawn(jekyll, ['build', '--config', jekyllConfig], {stdio: 'inherit', env: process.env})
    .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
  browsersync.notify('Rebuilded Jekyll');
  browsersync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('server', ['jekyll-build'], function() {
  return browsersync.init({
    port: config.port,
    server: {
      baseDir: config.paths.dest,
    }
  });
});

gulp.task('html', function() {
  return gulp.src('build/**/*.html')
    .pipe(htmlmin(config.htmlmin.options))
    .pipe(gulp.dest('build'));
});

/**
 * Sass
 */
gulp.task('sass', function () {
  return gulp.src(paths.sass + '/*.scss')
    .pipe(sass({
      outputStyle: config.sass.outputStyle,
      includePaths: ['node_modules/susy/sass']
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(size())
    .pipe(gulp.dest('source/_includes'))
    .pipe(gulp.dest(paths.css));
});

/**
 * Images
 */
gulp.task('imagemin', function () {
  return gulp.src(paths.imagesSrc + '/**/*')
    .pipe(plumber())
    .pipe(newer(paths.images))
    .pipe(imagemin({
      ignorePattern: '.svg',
      progressive: true,
      // svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(paths.images));
});


/**
 * Linting JS
 */

gulp.task('jshint', function() {
  return gulp.src(paths.jsSrc + '/**/*')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


/**
 * Webpack
 *
 * Bundle JavaScript files
 */
gulp.task('webpack', ['jshint'], function () {
  return gulp.src(entry)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpack({
      watch: argv.watch ? true : false,
      output: {
        filename: 'main.[hash].js',
      },
      resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
      },
      plugins: [
        // Adding frontmatter to JS files so Jekyll can process liquid tags -- http://adamyonk.com/2015/10/12/jekyll-and-webpack/
        // new webpackYO.BannerPlugin('---\n---\n\n', { raw: true }),
        new Manifest({
          filename: 'assets.json',
          path: './source/_data',
          fullPath: true,
          prettyPrint: true
        })
      ]
    }))
    .pipe(uglify())
    .pipe(size())
    .pipe(gulp.dest(paths.js));
});

// For internal use only
gulp.task('_webpack', function () {
  argv.watch = true;
  gulp.start('webpack');
});

/**
 * Build
 */
gulp.task('build', build, function (done) {
  var jekyllConfig = config.jekyll.config.default;
  if (argv.production) {
    process.env.JEKYLL_ENV = 'production';
    jekyllConfig += config.jekyll.config.production ? ',' + config.jekyll.config.production : '';
  } else {
    jekyllConfig += config.jekyll.config.development ? ',' + config.jekyll.config.development : '';
  }
  return cp.spawn('bundle', ['exec', 'jekyll', 'build', '--config', jekyllConfig], {stdio: 'inherit', env: process.env})
    .on('close', done);
});

/**
 * Default task, running just `gulp` will minify the images, compile the sass, js, and jekyll site,
 * launch BrowserSync, and watch files. Tasks can be configured by twobrain.config.json.
 */
gulp.task('default', tasks, function () {
  if (config.tasks.imagemin) {
    watch(paths.imagesSrc + '/**/*', function () {
      gulp.start('imagemin');
    });
  }

  if (config.tasks.sass) {
    watch(paths.sass + '/**/*', function () {
      gulp.start('sass');
    });
  }

  if (config.tasks['server']) {
    watch([
      '!./node_modules/**/*',
      '!./README.md',
      '!' + paths.dest + '/**/*',
      'gulpfile.js',
      'twobrain.config.js',
      '_config.yml',
      'source/_data/**/*.yml',
      'source/_includes/**/*',
      'source/_layouts/**/*',
      'source/_pages/**/*',
      paths.posts + '/**/*',
      paths.css + '/**/*',
      paths.js + '/**/*',
      paths.images + '/**/*'
    ], function () {
      gulp.start('jekyll-rebuild');
    });
  }
});

/**
 * Test
 */
gulp.task('test', ['build']);
