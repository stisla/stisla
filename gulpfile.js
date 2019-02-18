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

/**
 * Configuration
 * @type {String}
 */
var cssDir = './dist/assets/css',
    jsDir = './dist/assets/js',
    sassDir = './sources/scss/*.scss',
    imgDir = './dist/assets/img/*',
    /**
     * CSS main file
     * @type {Array}
     */
    CSSFiles = [
      // Required dependencies
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
      // Stisla core
      'dist/assets/css/style.css',
    ],

    CSSModules = [
      // Modules
      'node_modules/bootstrap-social/bootstrap-social.css',
      'node_modules/selectric/public/selectric.css',
      'node_modules/chocolat/dist/css/chocolat.css',
      'node_modules/prismjs/themes/prism.css',
      'node_modules/dropzone/dist/min/dropzone.min.css',
      'node_modules/jqvmap/dist/jqvmap.min.css',
      'node_modules/flag-icon-css/css/flag-icon.min.css',
      'node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
      'node_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
      'node_modules/summernote/dist/summernote-bs4.css',
      'node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
      'node_modules/codemirror/lib/codemirror.css',
      'node_modules/codemirror/theme/duotone-dark.css',
      'node_modules/bootstrap-daterangepicker/daterangepicker.css',
      'node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
      'node_modules/select2/dist/css/select2.min.css',
      'node_modules/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
      'node_modules/weathericons/css/weather-icons.min.css',
      'node_modules/weathericons/css/weather-icons-wind.min.css',
      'node_modules/fullcalendar/dist/fullcalendar.min.css',
      'node_modules/datatables.net-bs4/css/dataTables.bootstrap4.min.css',
      'node_modules/datatables.net-select-bs4/css/select.bootstrap4.min.css',
      'node_modules/ionicons201/css/ionicons.min.css',
      'node_modules/izitoast/dist/css/iziToast.min.css',
      // add more here
    ],

    components_css = [
      // Stisla core
      'dist/assets/css/components.css',
    ],

    JSFiles = [
      // Required dependencies
      'node_modules/jquery/dist/jquery.js',
      'node_modules/popper.js/dist/umd/popper.js',
      'node_modules/tooltip.js/dist/umd/tooltip.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'node_modules/nicescroll/dist/jquery.nicescroll.js',
      'node_modules/moment/moment.js',
      // Stisla core
      'dist/assets/js/stisla.js',
    ],

    JSModules = [
      // Modules
      'node_modules/jquery-pwstrength/jquery.pwstrength.js',
      'node_modules/selectric/public/jquery.selectric.js',
      'node_modules/chocolat/dist/js/jquery.chocolat.js',
      'node_modules/jquery-ui-dist/jquery-ui.js',
      'node_modules/prismjs/prism.js',
      'node_modules/dropzone/dist/dropzone.js',
      'node_modules/jquery-sparkline/jquery.sparkline.js',
      'node_modules/chart.js/dist/Chart.js',
      'node_modules/jqvmap/dist/jquery.vmap.js',
      'node_modules/jqvmap/dist/maps/jquery.vmap.world.js',
      'node_modules/jqvmap/dist/maps/jquery.vmap.indonesia.js',
      'node_modules/owl.carousel/dist/owl.carousel.js',
      'node_modules/summernote/dist/summernote-bs4.js',
      'node_modules/jquery_upload_preview/assets/js/jquery.uploadPreview.js',
      'node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',
      'node_modules/codemirror/lib/codemirror.js',
      'node_modules/codemirror/mode/javascript/javascript.js',
      'node_modules/cleave.js/dist/cleave.js',
      'node_modules/cleave.js/dist/addons/cleave-phone.us.js',
      'node_modules/bootstrap-daterangepicker/daterangepicker.js',
      'node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',
      'node_modules/bootstrap-timepicker/js/bootstrap-timepicker.js',
      'node_modules/select2/dist/js/select2.full.js',
      'node_modules/gmaps/gmaps.js',
      'node_modules/simpleweather/jquery.simpleWeather.js',
      'node_modules/sticky-kit/dist/sticky-kit.js',
      'node_modules/fullcalendar/dist/fullcalendar.js',
      'node_modules/datatables/media/js/jquery.dataTables.js',
      'node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js',
      'node_modules/datatables.net-select-bs4/js/select.bootstrap4.js',
      'node_modules/sweetalert/dist/sweetalert.min.js',
      'node_modules/izitoast/dist/js/iziToast.js',
      // add more here
      // Stisla functions
      'dist/assets/js/scripts.js'
    ];


/**
 * Helpers
 */

function _js_bundle(JSFiles, filename, jsDir) {
  return src(JSFiles)
  .pipe(plumber())
  .pipe(concat(filename))
  .pipe(uglify())
  .pipe(dest(jsDir))
  .pipe(notify({
    message: 'File <%= file.relative %> bundled successfully'
  }));
}

function _css_bundle(CSSFiles, filename, cssDir) {
  return src(CSSFiles)
  .pipe(plumber())
  .pipe(concat(filename))
  .pipe(postcss([autoprefixer(), cssnano()]))
  .pipe(dest(cssDir))
  .pipe(notify({
    message: 'File <%= file.relative %> bundled successfully'
  }));
}

/**
 * Execution
 */

function bundle_main_css() {
  return _css_bundle(CSSFiles, 'main.min.css', cssDir);
}

function bundle_modules_css() {
  return _css_bundle(CSSModules, 'modules.min.css', cssDir);
}

function bundle_components_css() {
  return _css_bundle(components_css, 'components.min.css', cssDir);
}

function bundle_main_js() {
  return _js_bundle(JSFiles, 'main.min.js', jsDir);
}

function bundle_modules_js() {
  return _js_bundle(JSModules, 'modules.min.js', jsDir);
}

function folder(){
   return src('*.*', {read: false})
        .pipe(dest('./dist/assets'))
        .pipe(dest('./dist/assets/css'))
        .pipe(dest('./dist/assets/js'))
        .pipe(dest('./dist/assets/img'))
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

function image(){
  return src(imgDir)
  .pipe(plumber())
  .pipe(imagemin([
    imageminMozjpeg({quality: 80})
  ]))
  .pipe(dest(imgDir))
  .pipe(plumber.stop())
}

function watching (){
  browserSync.init({
    server:{
      baseDir: "./"
    },
    port: 8080
  });
  watch('./sources/sass/*.scss', minify).on('change', browserSync.reload);
  watch("*.html").on('change', browserSync.reload);
}

function  watchcss(){
  watch('./sources/sass/*.scss', minify);
}

function template() {
  return src('pages/index-0.html')
    .pipe(nunjucks.compile({
      version: '2.3.0'
    }, {
      trimBlocks: true,
      lstripBlocks: true,
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
    .pipe(dest('dist'))
    .pipe(notify({
      message: 'File <%= file.relative %> compiled successfully'
    }));
}

//create folder first
// exports.folder = folder;
exports.html = template;
//then update source
exports.update = parallel(bundle_main_css, bundle_modules_css, bundle_components_css);
//minify  IMG SOURCE
exports.image = image;
//Run this command for styling OPs
exports.minify = minify;
//Run this command for dev.
exports.default = watching;
