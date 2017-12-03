"use strict";
const gulp       = require('gulp');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const debug      = require('gulp-debug');
const clean      = require('gulp-clean');
const gulpIf     = require('gulp-if');
const rename     = require('gulp-rename');
const concat     = require('gulp-concat');
const wrap       = require('gulp-wrap');
const rigger     = require('gulp-rigger')

const browserSync = require('browser-sync').create();

//const autoprefixer = require('gulp-autoprefixer'); // .pipe(autoprefixer)
//gulp-remember
//gulp-concat
//gulp-newer, gulp-changed

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; //set NODE_ENV=production; gulp scss
isDevelopment = true;

const path = {
    source : {
        html : ['src/*.html'],
        scss : ['src/*.scss'],
        js   : ['src/**/*.js'],
        img  : ['src/**/*.{jpg,jpeg,png}'],
        font : ['src/**/*.{ttf,otf}']
    },
    build : {
        html : 'build',
        js   : 'build/js',
        css  : 'build/css',
        img  : 'build/img',
        font : 'build/font'
    },
    watch : {
        html : ['src/**/*.html'],
        scss : ['src/**/*.scss'],
        js   : ['src/**/*.js'],
        img  : ['src/**/*.{jpg,jpeg,png}'],
        font : ['src/**/*.{ttf,otf}']
    }
}

gulp.task("clean", function(){
    return gulp.src('build', {read:false})
        .pipe(clean());
});

gulp.task('html', function(){
    gulp.src(path.source.html)
        
        .pipe(rigger())
        
        .pipe(gulp.dest(path.build.html));
});

gulp.task('js', function(){
    return gulp.src(path.source.js)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(gulpIf(isDevelopment, wrap('//<%= file.path %>\n<%= contents %>')))
        .pipe(concat('script.js')) //{newLine: ';'}
        .pipe(gulpIf(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest(path.build.js))
});

gulp.task("scss", function(){
    return gulp.src(path.source.scss)
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(isDevelopment,sourcemaps.write()))
        .pipe(gulp.dest(path.build.css))
});

gulp.task('img', function() {
    return gulp.src(path.source.img, { content: false}) //, {since: gulp.lastRun('img')})
        .pipe(rename({dirname:''}))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('font', function(){
    return gulp.src(path.source.font, { content: false}) //, {since: gulp.lastRun('img')})
    .pipe(rename({dirname:''}))
    .pipe(gulp.dest(path.build.font));
});

gulp.task('build', [ 'html', 'scss', 'js', 'img', 'font']);

gulp.task('watch',['build'], function(){
    gulp.watch(path.watch.scss, ['scss']);
    gulp.watch(path.watch.html, ['html']);
    gulp.watch(path.watch.js,   ['js']);
    gulp.watch(path.watch.img,  ['img']);
    gulp.watch(path.watch.font, ['font']);
    gulp.start('browserSync');
})

gulp.task('browserSync', function(){
    browserSync.init({
        server: 'build'
    });
    browserSync.watch('build/**/*.*').on('change', browserSync.reload);
});









//.pipe(gulpIf(isDevelopment, sourcemaps.write('.')))

// gulp.task(hello2);// gulp hello2 // gulp 4???
// function hello2(callback) { 
//     console.log("hello2");
//     callback()
// }

// gulp.task("scss", function(){
//     return gulp.src('src/style/**/*.scss')
//         //.pipe(debug({title:"src"}))
//         .pipe(sass().on('error', sass.logError))
//         //.pipe(debug({title:"css"}))
//         .pipe(gulp.dest('build/css'))
// });
    
        // gulp.src(['src/**/*.js', 'src/**/*.css'])
        // gulp.src(['src/**/*.js', '!node_modules/**'])
        // gulp.src('{js,css,img}/**/*.*')
        // gulp.src('moviesc/**/*.mp4', {read:false}) /// file.content === none
        //                              {read:false, since: new Date(...)}

/*
                console.log("path "+ file.dirname);
                console.log("dir " + file.dirname);
                console.log("basename " + file.basename);
                console.log("ext " + file.extname);
                console.log("stem "+file.stem);

        */

        /*
gulp.task("default", function() {
    return gulp.src("src/* * /*.*")

        .on("data", function(file){
            //console.log(file)
             src/1/1.js
                file.contents
                file.path
                file.cwd
                file.base
                //
                file.relative 
                file.dirname // .../src/1
                file.basename // 1.js
                file.stem    //1
                file.extname //.js
            
         })
        .pipe(gulp.dest(function(file){

                return file.extname == ".js" ? "js" :
                    file.extname == ".css" ? "css" : "dest2";
            }))
});
*/