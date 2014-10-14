var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var gulpify = require('gulp-browserify');
var del = require('del');

gulp.task('browserify', ['clean'], function() {
  gulp.src('client/script/main.js', {read:false})
      .pipe(gulpify({
        transform: ['reactify']
      }))
      .pipe(gulp.dest('./static/script'));
});

gulp.task('copy', ['clean'], function() {
  gulp.src([
      'client/lib/jquery-1.11.1.min.js',
      'client/lib/socket.io-1.1.0.min.js',
      'client/lib/bootstrap.min.js'
      ])
      .pipe(gulp.dest('./static/lib'));

  gulp.src([
      'client/img/glyphicons-halflings-white.png',
      'client/img/glyphicons-halflings.png'
      ])
      .pipe(gulp.dest('./static/img'));

  gulp.src([
      'client/css/main.css',
      'client/css/bootstrap-responsive.min.css',
      'client/css/bootstrap.min.css'
      ])
      .pipe(gulp.dest('./static/css'));

  gulp.src('client/index.html')
      .pipe(gulp.dest('./static'));
});

gulp.task('clean', function(cb) {
  del(['static'], cb);
});

gulp.task('default', ['copy', 'browserify']);