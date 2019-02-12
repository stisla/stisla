const { series } = require('gulp');

function clean(cb) {

  cb();
}

function build(cb) {
  cb();
}

exports.build = build;
exports.default = series(clean, build);
