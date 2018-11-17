const gulp = require('gulp');
// other
const connect = require('gulp-connect');
const changed  = require('gulp-changed');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
// css
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require("gulp-sass-glob"); //ディレクトリ一括指定
//img
const imagemin = require("gulp-imagemin");
//html
const ejs = require('gulp-ejs');
const minifyHTML = require('gulp-minify-html');
// js
const uglify = require("gulp-uglify");

var dist = './dist/';
var srcmap = './map/';
var src = './src/';

gulp.task('connect', function() {
  connect.server({
    root: dist,
    livereload: true
  });
});

gulp.task("js", function() {
    gulp.src(src + "js/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(dist + "js/"));
});

gulp.task('default', ['connect', 'watch']);
gulp.task('watch', ['sass', 'ejs', 'imagemin'], function(){
  gulp.watch(src + 'css/**/*.scss', ['sass']);
  gulp.watch(src + 'js/**/*.js', ['js']);
  gulp.watch(src + 'template/**/*.ejs', ['ejs']);
  gulp.watch(src + 'img/*.+(jpg|jpeg|png|gif|svg)', ['imagemin']);
});

gulp.task('ejs', function() {
  gulp.src([src + "template/*.ejs",
            src + "template/**/*.ejs",
            "!" + src + "template/_include/_*.ejs"])
  .pipe(ejs())
  .pipe(rename({ extname: '.html' }))
  .pipe(minifyHTML({ empty: true }))
  .pipe(gulp.dest(dist))
  .pipe(connect.reload());
});

gulp.task('sass', function(){
  gulp.src(src + 'css/*.scss')
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({sourcemap: true}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(autoprefixer({cascade: false}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write(srcmap))
    .pipe(gulp.dest(dist + 'css/'));
});


gulp.task('imagemin', function(){
  var srcGlob = src + 'img/*.+(jpg|jpeg|png|gif|svg)';
  var dstGlob = dist + 'img';
  var imageminOptions = {
    optimizationLevel: 7
  };

  gulp.src(srcGlob)
  .pipe(changed(dstGlob))
  .pipe(imagemin(imageminOptions))
  .pipe(gulp.dest(dstGlob));

});
