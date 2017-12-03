"use strict";
const gulp       = require('gulp');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
//const debug      = require('gulp-debug');
const clean      = require('gulp-clean');
const gulpIf     = require('gulp-if');
//const rename     = require('gulp-rename');
//const concat     = require('gulp-concat');
//const wrap       = require('gulp-wrap');
//const rigger     = require('gulp-rigger')

const autoprefixer = require('gulp-autoprefixer'); // .pipe(autoprefixer)

const browserSync = require('browser-sync').create();



var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; //set NODE_ENV=production; gulp scss
isDevelopment = true;

const path = {
    source : {
        scss : ['project/scss/style.scss','project/scss/grid.scss'],
    },
    build : {
        css  : 'project/css',
    }
}

gulp.task("clean", function(){
    return gulp.src('project/css', {read:false})
        .pipe(clean());
});

gulp.task("scss", function(){
    return gulp.src(path.source.scss)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions','not ie <= 8', 'since 2013'],
            cascade: false
        }))
        .pipe(gulpIf(isDevelopment,sourcemaps.write('.')))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('build', ['scss']);

gulp.task('watch',['build'], function(){
    gulp.watch(path.source.scss, ['scss']);
    gulp.start('browserSync');
})

gulp.task('browserSync', function(){
    browserSync.init({
        server: 'project'
    });
    browserSync.watch('project/**/*.*').on('change', browserSync.reload);
});