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

const lib_dir = './lib';

//----------------------------------------------------------------------
//  関数定義
//----------------------------------------------------------------------
// SCSS コンパイル
const compile_sass = () =>
  src([`${lib_dir}/**/*.scss`, `!${lib_dir}/**/*.min.css`])
    // watch中にエラーが発生してもwatchが止まらないようにする
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))

    // sourcemap初期化
    .pipe(sourcemaps.init())

    // sassのコンパイルをする
    .pipe(sass())

    // ベンダープレフィックスを自動付与
    .pipe(autoprefixer())

    // sourcemapファイルを出力するパスを指定、書き込み
    .pipe(sourcemaps.write('./'))

    .pipe(dest(lib_dir));

// CSS 縮小
const minify_css = () =>
  src([`${lib_dir}/**/*.css`, `!${lib_dir}/**/*.min.css`])
    // watch中にエラーが発生してもwatchが止まらないようにする
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))

    // minify
    .pipe(minifyCss({advanced:false}))

    // 拡張子変更
    .pipe(rename({extname: '.min.css'}))
    .pipe(dest(lib_dir));

//JS
const minify_js = () =>
  src([`${lib_dir}/**/*.js`, `!${lib_dir}/**/*.min.js`])
    // sourcemap初期化
    .pipe(sourcemaps.init())

    // watch中にエラーが発生してもwatchが止まらないようにする
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))

    // コード内の不要な改行やインデントを削除
    .pipe(uglify())

    // 拡張子変更
    .pipe(rename({extname: '.min.js'}))

    // sourcemapファイルを出力するパスを指定、書き込み
    .pipe(sourcemaps.write('./'))
    .pipe(dest(lib_dir));

//----------------------------------------------------------------------
//  watch
//----------------------------------------------------------------------
const watch_sass = () =>
  watch([`${lib_dir}/**/*.scss`, `!${lib_dir}/**/*.min.css`], series(
    compile_sass,
    minify_css
  ));

const watch_js = () =>
  watch([`${lib_dir}/**/*.js`, `!${lib_dir}/**/*.min.js`], minify_js);


//----------------------------------------------------------------------
//  タスク定義
//----------------------------------------------------------------------
exports.compile = parallel(
  watch_sass,
  watch_js
);
