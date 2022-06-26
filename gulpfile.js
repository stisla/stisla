/**
 * Imports
 */
const {src, dest, watch, parallel} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const nunjucks = require('gulp-nunjucks');
const color = require('gulp-color');
const nodePath = require('path');

/**
 * Configuration
 * @type {String}
 */
let cssDir = 'assets/css',
    jsDir = 'assets/js',
    htmlDir = 'src/pages',
    scssDir = 'src/scss',
    imgDir = 'assets/img';

let jsPathPattern = '/**/*.js',
    htmlPathPattern = '/**/*.html',
    scssPathPattern = '/**/*.scss',
    imgPathPattern = '/**/*.*';

/**
 * Helpers
 */
function _compileToHTML(path, onEnd, log=true, ret=false) {
  if(log)
    _log('[HTML] Compiling: ' + path, 'GREEN');

  let compileToHTML = src(path, { base: htmlDir })
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

  if(ret) return compileToHTML;
}

function _compileToSCSS(path, onEnd, log=true, ret=false) {
  if(log)
    _log('[SCSS] Compiling:' + path, 'GREEN');

  let compileToSCSS = src(path)
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

  if(ret) return compileToSCSS;
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
  return src(imgDir + imgPathPattern)
  .pipe(plumber())
  .pipe(imagemin([
    imageminMozjpeg({quality: 80})
  ]))
  .pipe(dest(imgDir))
  .pipe(plumber.stop());
}

function compileToSCSS() {
  return _compileToSCSS(scssDir + scssPathPattern, null, false, true);
}

function compileToHTML() {
  return _compileToHTML(htmlDir + htmlPathPattern, null, false, true);
}

function watching() {
  compileToSCSS();
  compileToHTML();

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
    htmlDir + htmlPathPattern,
    scssDir + scssPathPattern,
    jsDir + jsPathPattern,
    imgDir + imgPathPattern,
  ]).on('change', (file) => {
    file = file.replace(/\\/g, nodePath.sep);

    if(file.indexOf('.scss') > -1) {
      _compileToSCSS(scssDir + scssPathPattern, () => {
        return browserSync.reload();
      });
    }

    if(file.indexOf('layouts') > -1 && file.indexOf('.html') > -1) {
      _compileToHTML(htmlDir + htmlPathPattern, () => {
        return browserSync.reload();
      });
    }else if(file.indexOf('.html') > -1) {
      _compileToHTML(file, () => {
        return browserSync.reload();
      });
    }

    if(file.indexOf(jsDir) > -1 || file.indexOf(imgDir) > -1) {
      return browserSync.reload();
    }
  });
}

Object.assign(exports, {
  folder,
  image,
  scss: compileToSCSS,
  html: compileToHTML,
  dist: parallel(folder, compileToSCSS, compileToHTML),
  default: watching
});
