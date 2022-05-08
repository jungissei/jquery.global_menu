//----------------------------------------------------------------------
//  モード
//----------------------------------------------------------------------
'use strict';

//----------------------------------------------------------------------
//  モジュール読み込み
//----------------------------------------------------------------------
const { src, watch, dest, series, parallel } = require('gulp'),
  plumber = require('gulp-plumber'),
  notify = require('gulp-notify'),
  sass = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  rename   = require('gulp-rename'),
  minifyCss  = require('gulp-minify-css'),
  uglify = require('gulp-uglify');


//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
// SCSS コンパイル
const compile_sass = () =>
  src(['./lib/**/*.scss', '!./lib/**/*.min.css'])
    .pipe(plumber({                    // watch中にエラーが発生してもwatchが止まらないようにする
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(sass({
      includePaths: ['lib']
    }))                              // sassのコンパイルをする
    .pipe(autoprefixer())                      // ベンダープレフィックスを自動付与
    .pipe(dest('./lib'));

// CSS 縮小
const minify_css = () =>
  src(['./lib/**/*.css', '!./lib/**/*.min.css'])
    .pipe(sourcemaps.init())                   // sourcemap初期化
    .pipe(plumber({                    // watch中にエラーが発生してもwatchが止まらないようにする
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(minifyCss({advanced:false})) // minify
    .pipe(rename({extname: '.min.css'}))  // 拡張子変更
    .pipe(sourcemaps.write('./'))        // sourcemapファイルを出力するパスを指定、書き込み
    .pipe(dest('./lib'));

//JS
const minify_js = () =>
  src(['./lib/**/*.js', '!./lib/**/*.min.js'])
    .pipe(sourcemaps.init())                      // sourcemap初期化
    .pipe(plumber({                       // watch中にエラーが発生してもwatchが止まらないようにする
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(uglify())                               // コード内の不要な改行やインデントを削除
    .pipe(rename({extname: '.min.js'}))      // 拡張子変更
    .pipe(sourcemaps.write('./'))           // sourcemapファイルを出力するパスを指定、書き込み
    .pipe(dest('./lib'));

//----------------------------------------------------------------------
//  watch
//----------------------------------------------------------------------
const watch_sass = () =>
  watch(['./lib/**/*.scss', '!./lib/**/*.min.css'], series(
    compile_sass,
    minify_css
  ));

const watch_js = () =>
  watch(['./lib/**/*.js', '!./lib/**/*.min.js'], minify_js);


//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.compile = parallel(
  watch_sass,
  watch_js
);
