var gulp = require('gulp');
var gulpify = require('gulp-browserify');
var replace = require('gulp-replace');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var del = require('del');

var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');

var isProduction = process.env.NODE_ENV === 'production';
var serviceHost = isProduction ? '54.86.176.185' : 'localhost';
var servicePort = isProduction ? 8001 : 8001;
var socketHost = isProduction ? '54.86.176.185' : 'localhost';
var socketPort = isProduction ? 8002 : 8002;

var convertify = function(target) {
  var p = gulp.src(target, {read:false})
              .pipe(gulpify({
                shim: {
                  react: {
                    path: 'client/lib/react-0.12.2.min.js',
                    exports: 'React'
                  }
                },
                transform: ['reactify']
              }));

  if(isProduction) {
    pipe(buffer()).pipe(uglify());
  }
  p.pipe(gulp.dest('./static/script'));
};

gulp.task('browserify', ['clean'], function() {
  convertify('client/script/exchange.js');
  convertify('client/script/reproduction.js');
});

gulp.task('copy', ['clean'], function() {
  gulp.src([
      'client/lib/jquery-1.11.1.min.js',
      'client/lib/socket.io-1.1.0.min.js',
      'client/lib/bootstrap-2.3.2.min.js',
      'client/lib/react-0.12.2.min.js'
      ])
      .pipe(gulp.dest('./static/lib'));

  gulp.src([
      'client/img/glyphicons-halflings-white.png',
      'client/img/glyphicons-halflings.png',
      'client/img/add-plus.svg',
      'client/img/edit.svg',
      'client/img/open.svg',
      'client/img/close.svg',
      'client/img/delete.svg'
      ])
      .pipe(gulp.dest('./static/img'));

  gulp.src([
      'client/css/bootstrap-responsive.min.css',
      'client/css/bootstrap.min.css'
      ])
      .pipe(gulp.dest('./static/css'));

  gulp.src([
        'client/css/main.css',
        'client/css/exchange.css',
        'client/css/reproduction.css'
      ])
      .pipe(minifycss())
      .pipe(gulp.dest('./static/css'));

  gulp.src([
        'client/index.html',
        'client/exchange.html',
        'client/reproduction.html'
      ])
      .pipe(replace(/@serviceHost/, serviceHost))
      .pipe(replace(/@servicePort/, servicePort))
      .pipe(replace(/@socketHost/, socketHost))
      .pipe(replace(/@socketPort/, socketPort))
      .pipe(gulp.dest('./static'));

});

gulp.task('clean', function(cb) {
  del(['static'], cb);
});

gulp.task('default', ['copy', 'browserify']);