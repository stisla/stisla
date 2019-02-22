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

/**
 * Configuration
 * @type {String}
 */
var cssDir = './assets/css',
    jsDir = './assets/js',
    htmlDir = './sources/pages',
    sassDir = './sources/scss',
    imgDir = './assets/img/*';

/**
 * Helpers
 */

function _compile_html(path, log=true, ret=false) {
  if(log)
    _log('[HTML] Compiling:' + path, 'GREEN');

  let compile_html = src(path, { base: htmlDir })
  .pipe(plumber())
  .pipe(nunjucks.compile({
    version: '2.3.0'
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
  .pipe(dest('pages'))
  .pipe(plumber.stop());

  if(ret) return compile_html;

  if(log)
    _log('[HTML] Finished', 'GREEN');
}

function _compile_scss(path, log=true, ret=false) {
  if(log)
    _log('[SCSS] Compiling:' + path, 'GREEN');

  let compile_scss = src(path)
  .pipe(plumber())
  .pipe(sass({
    errorLogToConsole: true
  }))
  .on('error', console.error.bind(console))
  .pipe(rename({
    dirname: '',
    extname: '.css'
  }))
  .pipe(postcss([autoprefixer()]))
  .pipe(dest(cssDir))
  .pipe(plumber.stop());

  if(ret) return compile_scss;

  if(log)
    _log('[SCSS] Finished', 'GREEN');
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

function minify(){
  return src(sassDir)
  .pipe(plumber())
  .pipe(sass({
    errorLogToConsole: true
  }))
  .on('error', console.error.bind( console ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(dest(cssDir))
  .pipe(notify({
    message: 'Minify <%= file.relative %> berhasil bos'
  }));
}

function image() {
  return src(imgDir)
  .pipe(plumber())
  .pipe(imagemin([
    imageminMozjpeg({quality: 80})
  ]))
  .pipe(dest(imgDir))
  .pipe(plumber.stop());
}

function compile_scss() {
  return _compile_scss(sassDir + '/*.scss', false, true);
}

function compile_html() {
  return _compile_html(htmlDir + '/*.html', false, true);
}

function watching() {
  /**
   * BrowserSync initialization
   * @type {Object}
   */
  browserSync.init({
    server:{
      baseDir: "./"
    },
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    },
    startPath: 'pages/index.html',
    port: 8080
  });

  /**
   * Watch ${htmlDir}
   */
  watch([htmlDir + '/*.html', sassDir + '/*.scss']).on('change', (file) => {
    if(file.indexOf('.scss') > -1) {
      _compile_scss(file);
    }

    if(file.indexOf('.html') > -1) {
      _compile_html(file);
    }

    browserSync.reload();
  });
}

// Create folder first
exports.folder = folder;

// Minify images
exports.image = image;

// Run this command for styling OPs
exports.minify = minify;

// Compile SCSS
exports.scss = compile_scss;

// Compile HTML
exports.html = compile_html;

// Dist
exports.dist = parallel(folder, compile_scss, compile_html);

// Run this command for dev.
exports.default = watching;
