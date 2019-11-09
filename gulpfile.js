var gulp = require('gulp');
// var gutil = require('gulp-util');
// var bower = require('bower');
var concat = require('gulp-concat');
// var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
// var rename = require('gulp-rename');
// var sh = require('shelljs');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');
// var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var babel = require('gulp-obfuscate');
var clean = require('gulp-clean');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var spriter = require('gulp-css-spriter');
var spritesmith = require('gulp.spritesmith');


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

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function() {
  return gulp.src(['./js/index.js'])
    .pipe(ngmin({
      dynamic: false
    }))
    .pipe(stripDebug())
    .on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString());
            })
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./rev/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/js'));
});

gulp.task('jscompress', function() {
   return gulp.src('./js/index.js') //转es5之后的js目录
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./rev/js')); //输出的文件夹
});

gulp.task("es62es5", function () {
  return gulp.src("./js/index.js") //es6文件地址
    .pipe(babel())
    .pipe(gulp.dest("./rev"));
});

//Html替换css、js文件版本
gulp.task('revHtml', function() {
  return gulp.src(['./rev/**/*.json', './*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('./'));
});

// gulp.task('revCss', function () {

//     return gulp.src('./img/*.png')//需要合并的图片地址
//         .pipe(spritesmith({
//             imgName: 'sprite.png',//保存合并后图片的地址
//             cssName: 'css/sprite.css',//保存合并后对于css样式的地址
//             padding:5,//合并时两个图片的间距
//             algorithm: 'binary-tree',//注释1
//             cssTemplate: function (data) {
//                 var arr=[];
//                 data.sprites.forEach(function (sprite) {
//                     arr.push(".icon-"+sprite.name+
//                     "{" +
//                     "background-image: url('"+sprite.escaped_image+"');"+
//                     "background-position: "+sprite.px.offset_x+"px "+sprite.px.offset_y+"px;"+
//                     "width:"+sprite.px.width+";"+
//                     "height:"+sprite.px.height+";"+
//                     "}\n");
//                 });
//                 return arr.join("");
//             }

//         }))
//         .pipe(gulp.dest('./rev'));
// });

//开发构建
gulp.task('default', function(done) {
  condition = false;
  runSequence(
    ['clean'], ['revCss'], ['revHtml'],
    done);
});




