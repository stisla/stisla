// Gulp file config by iqbal

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
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
//dir
var cssDir = './assets/css'; 
var jsDir = './assets/js'; 
var sassDir = './assets/sass/*.scss';
var imgDir = './assets/img/*';

//css
var cssFileOne = 'path';
var cssFileTwo = 'path';
var cssFileThree = 'path';

//js
var jsFileOne = 'path';
var jsFileTwo = 'path';
var jsFileThree = 'path';

// moving js
function js(){
	return src([jsFileOne, jsFileTwo, jsFileThree])
     .pipe(plumber())
	 .pipe(concat('plugin.min.js'))
	 .pipe(uglify())
	 .pipe(dest(jsDir))
	 .pipe(notify({
	 	message: 'File <%= file.relative %> wis dadi' 
	 }));
}

// moving css
function css(){
	return src([cssFileOne,cssFileTwo,cssFileThree,])
	 .pipe(plumber())
	 .pipe(concat('plugin.min.css'))
	 .pipe(postcss([autoprefixer(), cssnano()]))
	 .pipe(dest(cssDir))
	 .pipe(notify({
	 	message: 'File <%= file.relative %> wis dadi'
	 }));
}

//make structural folder
function folder(){
	 return src('*.*', {read: false})
        .pipe(dest('./sandbox/_test'))
        .pipe(dest('./assets'))
        .pipe(dest('./assets/sass'))
        .pipe(dest('./assets/css'))
        .pipe(dest('./assets/js'))
        .pipe(dest('./assets/img'))
}

//minify compile
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


//minfy image
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
	watch('./assets/sass/*.scss',minify).on('change',browserSync.reload);
	watch("*.html").on('change',browserSync.reload);
}

function  watchcss(){
	watch('./assets/sass/*.scss',minify);
}

//create folder first
exports.folder = folder;
//then update source
exports.update = parallel(js, css);
//updating  JS SOURCE ONLY
exports.js = js;
//updating  CSS SOURCE ONLY
exports.css = css;
//minify  IMG SOURCE
exports.image = image;
//Run this command for styling OPs
exports.minify = minify;
//Run this command for dev.
exports.default = watching;