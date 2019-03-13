/**
 * Imports
 */
const {src, dest, watch, parallel} = require('gulp');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const nunjucks = require('gulp-nunjucks');
const color = require('gulp-color');
const nodePath = require('path');

/**
 * Configuration
 * @type {String}
 */
var cssDir = 'assets/css',
    jsDir = 'assets/js',
    htmlDir = 'sources/pages',
    sassDir = 'sources/scss',
    imgDir = 'assets/img';

/**
 * Helpers
 */

function _compile_html(path, onEnd, log=true, ret=false) {
  if(log)
    _log('[HTML] Compiling: ' + path, 'GREEN');

  let compile_html = src(path, { base: htmlDir })
  .pipe(plumber())
  .pipe(nunjucks.compile({
    version: '2.3.0',
    site_name: 'Stisla'
  },
  /**
   * Nunjucks options
   */
  {
    trimBlocks: true,
    lstripBlocks: true,
    /**
     * Nunjucks filters
     * @type {Object}
     */
    filters: {
      is_active: (str, reg, page) => {
        reg = new RegExp(reg, 'gm');
        reg = reg.exec(page);
        if(reg != null) {
          return str;
        }
      }
    }
  }))
  .on('error', console.error.bind(console))
  .on('end', () => {
    if(onEnd)
      onEnd.call(this);

    if(log)
      _log('[HTML] Finished', 'GREEN');
  })
  .pipe(dest('pages'))
  .pipe(plumber.stop());

  if(ret) return compile_html;
}

function _compile_scss(path, onEnd, log=true, ret=false) {
  if(log)
    _log('[SCSS] Compiling:' + path, 'GREEN');

  let compile_scss = src(path)
  .pipe(plumber())
  .pipe(sass({
    errorLogToConsole: true
  }))
  .on('error', console.error.bind(console))
  .on('end', () => {
    if(onEnd)
      onEnd.call(this);

    if(log)
      _log('[SCSS] Finished', 'GREEN');
  })
  .pipe(rename({
    dirname: '',
    extname: '.css'
  }))
  .pipe(postcss([autoprefixer()]))
  .pipe(dest(cssDir))
  .pipe(plumber.stop());

  if(ret) return compile_scss;
}

function _log(str, clr) {
  if(!clr) clr = 'WHITE';
  console.log(color(str, clr));
}

/**
 * End of helper
 */

/**
 * Execution
 */

function folder() {
  return src('*.*', {read: false})
  .pipe(dest('./assets'))
  .pipe(dest('./assets/css'))
  .pipe(dest('./assets/js'))
  .pipe(dest('./assets/img'));
}

function image() {
  return src(imgDir + '/**/*.*')
  .pipe(plumber())
  .pipe(imagemin([
    imageminMozjpeg({quality: 80})
  ]))
  .pipe(dest(imgDir))
  .pipe(plumber.stop());
}

function compile_scss() {
  return _compile_scss(sassDir + '/**/*.scss', null, false, true);
}

function compile_html() {
  return _compile_html(htmlDir + '/**/*.html', null, false, true);
}

function watching() {
  compile_scss();
  compile_html();

  /**
   * BrowserSync initialization
   * @type {Object}
   */
  browserSync.init({
    server:{
      baseDir: "./"
    },
    startPath: 'pages/index.html',
    port: 8080
  });

  /**
   * Watch ${htmlDir}
   */
  watch([
    htmlDir + '/**/*.html',
    sassDir + '/**/*.scss',
    jsDir + '/**/*.js',
    imgDir + '/**/*.*',
  ]).on('change', (file) => {
    file = file.replace(/\\/g, nodePath.sep);

    if(file.indexOf('.scss') > -1) {
      _compile_scss(sassDir + '/**/*.scss', () => {
        return browserSync.reload();
      });
    }

    if(file.indexOf('layouts') > -1 && file.indexOf('.html') > -1) {
      _compile_html(htmlDir + '/*.html', () => {
        return browserSync.reload();
      });
    }else if(file.indexOf('.html') > -1) {
      _compile_html(file, () => {
        return browserSync.reload();
      });
    }

    if(file.indexOf(jsDir) > -1 || file.indexOf(imgDir) > -1) {
      return browserSync.reload();
    }
  });
}

// Create folder first
exports.folder = folder;

// Minify images
exports.image = image;

// Compile SCSS
exports.scss = compile_scss;

// Compile HTML
exports.html = compile_html;

// Dist
exports.dist = parallel(folder, compile_scss, compile_html);

// Run this command for dev.
exports.default = watching;
