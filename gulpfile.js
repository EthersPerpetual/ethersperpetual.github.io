var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var spriter = require('gulp-css-spriter');


gulp.task("clean", function() {
  return gulp.src('./rev')
    .pipe(clean());
})

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    var timestamp = +new Date();
    return gulp.src(['./css/*.css','./css/iconfont/iconfont.css'])
         .pipe(spriter({
            // 生成的spriter的位置
            'spriteSheet': './rev/sprite'+timestamp+'.png',
            // 生成样式文件图片引用地址的路径
            // 如下将生产：backgound:url(../images/sprite20324232.png)
            'pathToSpriteSheetFromCSS': 'sprite'+timestamp+'.png'
        }))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(concat('all.min.css'))
        .pipe(rev())
        .pipe(gulp.dest('./rev'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev'));
});




//Html替换css、js文件版本
gulp.task('revHtml', function() {
  return gulp.src(['./rev/**/*.json', './*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./'));
});



//开发构建
gulp.task('default', function(done) {
  condition = false;
  runSequence(
    ['clean'], ['revCss'], ['revHtml'],
    done);
});




