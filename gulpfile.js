const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const gutil = require('gulp-util');
const del = require('del');

// 编译前清空缓存
gulp.task('clean', function(cb) {
  console.log('clean catch。。。');
  del([
    'dist'
  ], cb);
})

// commonjs 模块入口 文件打包处理 begin
// 编译并压缩js

gulp.task('convert-cj', function(){
  console.log('开始转码es6并压缩')
  return gulp.src(['src/**/*', '!src/index.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/comment-cj'))
})

// browserify
gulp.task("browserify", ['convert-cj'] , function () {
  console.log('将require js 转码')
  var b = browserify({
    entries: "dist/comment-cj/index-cj.js"
  });

  return b.bundle()
    .pipe(source("index.js"))
    .pipe(gulp.dest("dist/comment-cj"))
});

// 删除中间过程产生的无用文件
gulp.task("clean-comment-cj", ['browserify'], function(cb) {
  del([
    'dist/comment-cj/**/*',
    // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
    '!dist/comment-cj/index.js'
  ], cb);
})

// ES6 模块入口 文件打包处理 begin
gulp.task('move-es6', function(){
  return gulp.src(['src/**/*', '!src/index-cj.js'])
    .pipe(gulp.dest('dist/comment'));
})

// demo
// 清空demo缓存
gulp.task("clean-demo", function(cb) {
  console.log('clean demo catch ...')
  del([
    'demo/dist'
  ], cb);
})

gulp.task("demo-babel", function(){
  console.log('开始转码es6并压缩 demo')
  return gulp.src(['demo/src/index.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('demo/dist'))
})
gulp.task("demo-browserify", ['demo-babel'] , function () {
  var b = browserify({
    entries: "demo/dist/index.js"
  });
  return b.bundle()
    .pipe(source("build.js"))
    .pipe(gulp.dest("demo/dist"))
});

gulp.task('start-cj', ['convert-cj', 'browserify', 'clean-comment-cj']);
gulp.task('start-js', ['move-es6']);

gulp.task('start-demo', ['demo-babel', 'demo-browserify']);

// 编译插件
gulp.task('start', ['clean', 'start-cj', 'start-js']);
// 编译demo
gulp.task('demo-build', ['clean-demo', 'start-demo']);