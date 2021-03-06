'use strict';

/**
 * Loading modules
 */

var argv         = require('yargs').argv;
var autoprefixer = require('autoprefixer');
var browsersync  = require('browser-sync').create();
var del          = require('del');
var cp           = require('child_process');
var eslint       = require('gulp-eslint');
var gulp         = require('gulp');
var htmlmin      = require('gulp-htmlmin');
var imagemin     = require('gulp-imagemin');
var jekyll       = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var Manifest     = require('assets-webpack-plugin');
var named        = require('vinyl-named');
var newer        = require('gulp-newer');
var plumber      = require('gulp-plumber');
var pngquant     = require('imagemin-pngquant');
var postcss      = require('gulp-postcss');
var pxtorem      = require('postcss-pxtorem');
var rsync        = require('gulp-rsync');
var sass         = require('gulp-sass');
var size         = require('gulp-size');
var SriHashes    = require('sri-stats-webpack-plugin');
var svgmin       = require('gulp-svgmin');
var UglifyJS     = require('uglifyjs-webpack-plugin');
var watch        = require('gulp-watch');
var webpack      = require('webpack-stream');
var webpack2     = require('webpack');


/**
 * Load configurations & set variables
 */
var config       = require('./twobrain.config.js');
var tasks        = [];
var build        = [];
var paths        = {};
var entry        = [];


/**
 * Load PostCSS modules
 */
var processors = [
  autoprefixer({browsers: config.autoprefixer.browsers}),
  // require('css-mqpacker')(),
  require('postcss-merge-rules'),
  pxtorem( config.pxtorem.options ),
];


/**
 * Set default & build tasks
 */
Object.keys(config.tasks).forEach(function(key) {
  if (config.tasks[key]) {
    tasks.push(key === 'webpack' ? '_' + key : key);
  }
});

Object.keys(config.tasks).forEach(function(key) {
  if (config.tasks[key] && key !== 'server') {
    build.push(key);
  }
});


/**
 * Paths
 */
Object.keys(config.paths).forEach(function(key) {
  if (key !== 'assets') {
    if (config.paths.assets === '') {
      paths[key] = './' + config.paths[key];
    } else {
      paths[key] = config.paths.assets + '/' + config.paths[key];
    }
  }
});

for (let i = 0; i <= config.js.entry.length - 1; i++) {
  entry.push(paths.jsSrc + '/' + config.js.entry[i]);
}


/**
 * Clean directories before generating new assets
 */

 gulp.task('clean', function() {
   del(paths.images);
   del(paths.js);
   del(paths.css);
   del('build/**/*');
 });


/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function(done) {
  let jekyllConfig = config.jekyll.config.default;
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
gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
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
    },
  });
});


/**
 * Minify HTML files
 */

gulp.task('html', function() {
  return gulp.src('build/**/*.html')
    .pipe(htmlmin(config.htmlmin.options))
  .pipe(gulp.dest('build'));
});


/**
 * Sass
 */
gulp.task('sass', function() {
  return gulp.src(paths.sass + '/*.scss')
    .pipe(sass({
      outputStyle: config.sass.outputStyle,
      includePaths: ['node_modules/susy/sass'],
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(size())
  .pipe(gulp.dest('source/_includes'))
  .pipe(gulp.dest(paths.css));
});


/**
 * Images
 */

 gulp.task('svgmin', function() {
   return gulp.src(paths.imagesSrc + '/_svg/logo.svg')
     .pipe(svgmin({
       plugins: [{
         cleanupNumericValues: {
           floatPrecision: 3,
         },
       }],
     }))
     .pipe(gulp.dest(config.paths.includes));
 });

gulp.task('imagemin', ['svgmin'], function() {
  return gulp.src(paths.imagesSrc + '/**/*')
    .pipe(plumber())
    .pipe(newer(paths.images))
    .pipe(imagemin({
      ignorePattern: '.svg',
      progressive: true,
      use: [pngquant()],
    }))
  .pipe(gulp.dest(paths.images));
});


/**
 * Linting JS
 */
gulp.task('eslint', function() {
  return gulp.src(paths.jsSrc + '/**/*')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


/**
 * Webpack
 *
 * Bundle JavaScript files
 * Compiles javascript files, writes asset manifest & generates sri hashes
 */
gulp.task('webpack', function() {
  return gulp.src(entry)
    .pipe(plumber())
    .pipe(named())
    .pipe(webpack({
      watch: argv.watch ? true : false,
      output: {
        filename: '[name].[hash].js',
      },
      plugins: [
        new UglifyJS({
          compress: {
            warnings: false,
          },
          comments: false,
        }),
        new Manifest({
          filename: 'assets.json',
          path: 'source/_data',
          fullPath: true,
          prettyPrint: true,
        }),
        new SriHashes({
          write: true,
          saveAs: 'source/_data/sriHashes.json',
        }),
      ],
    }, webpack2))
    .pipe(size())
  .pipe(gulp.dest(paths.js));
});

// For internal use only
gulp.task('_webpack', function() {
  argv.watch = true;
  gulp.start('webpack');
});

/**
 * Build
 */
gulp.task('build', build, function(done) {
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
gulp.task('default', tasks, function() {
  if (config.tasks.imagemin) {
    watch(paths.imagesSrc + '/**/*', function() {
      gulp.start('imagemin');
    });
  }

  if (config.tasks.sass) {
    watch(paths.sass + '/**/*', function() {
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
      paths.images + '/**/*',
    ], function() {
      gulp.start('jekyll-rebuild');
    });
  }
});


/**
 * Test
 */
gulp.task('test', ['build']);


/**
 * Assets
 */
gulp.task('assets', ['sass', 'webpack', 'imagemin']);


/*
 * Copy files and folder to server via rsync
 */

 gulp.task('deploy', function() {
   return gulp.src([config.paths.dest, config.paths.dest + '.htaccess'])
     .pipe(rsync(config.rsync.options));
 });
