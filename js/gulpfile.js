var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var img = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');



 gulp.task('minjs_my', function() {
  
  return gulp.src('main/**/*.js')
 .pipe(concat('my.js'))
 .pipe(gulp.dest('public'))
 .pipe(rename({suffix: '.min'}))
 .pipe(uglify({mangle:false}))
 .pipe(gulp.dest('public'));
 });

  gulp.task('mincss_my', function() {
 
      return gulp.src('main/**/*.css')
         .pipe(concat('my.css'))
        .pipe(gulp.dest('public'))
         .pipe(rename({suffix: '.min'}))
         .pipe(minifycss())
        .pipe(gulp.dest('public'));
 });

  gulp.task('minimg_my', function() {
 
     return gulp.src('res/**/*.{jpg,png,gif}', { base: 'res' })
         .pipe(img())
         .pipe(gulp.dest('res'));
 });

  gulp.task('default', function() {

     gulp.start( 'minjs_my', 'mincss_my', 'minimg_my');
 });