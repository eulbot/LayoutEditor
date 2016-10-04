var gulp = require('gulp');
var ts = require('gulp-typescript');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function () {
  gulp.start('watch');
});

gulp.task('compile-typescript', function () {
    return gulp.src(['typings/index.d.ts', 'app/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(ts({
            target: 'ES5',
            out: 'mapp.ple.js'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile-less', function () {
    return gulp.src('styles/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./styles'));
});

gulp.task('watch', function () {
  gulp.watch('app/**/*.ts', ['compile-typescript']);
  gulp.watch('styles/*.less', ['compile-less']);
});