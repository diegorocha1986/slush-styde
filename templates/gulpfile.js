var gulp      = require('gulp'),
  stylus      = require('gulp-stylus'),
  connect     = require('gulp-connect'),
  changed     = require('gulp-changed'),
  spritesmith = require('gulp.spritesmith'),
  plumber     = require('gulp-plumber'),
  nib         = require('nib'),
  rupture     = require('rupture'),
  jade        = require('gulp-jade');

var path = {
  js: ['assets/js/**/*.js', '!assets/js/**/*.min.js'],
  stylus: ['assets/stylus/**/*.styl'],
  css: ['assets/css/**/*.css', '!assets/css/**/*.min.css'],
  img: ['assets/img/*'],
  jade: ['assets/jade/**/*.jade', 'assets/jade/layouts/*.jade', 'assets/jade/includes/*.jade'],
  jadeCompile: ['assets/jade/**/*.jade', '!assets/jade/layouts/*.jade', '!assets/jade/includes/*.jade'],
  html: ['**/*.html']
};

gulp.task('sprite', function() {
  var spriteData = 
    gulp.src('assets/img/sprites/*.*')
    .pipe(spritesmith({
      imgPath: '../img/sprite.png',
      imgName: 'sprite.png',
      cssName: 'sprite.styl',
      cssFormat: 'stylus',
      algorithm: 'binary-tree'
    }));

  spriteData.img.pipe(gulp.dest('assets/img/'));
  spriteData.css.pipe(gulp.dest('assets/stylus/core/'));
});

gulp.task('templates', function() {
  var LOCALS = {
    title: 'Project Title'
  };
 
  gulp.src(path.jadeCompile)
    .pipe(jade({
      locals: LOCALS
    }))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

gulp.task('stylus', function () {
  return gulp.src('assets/stylus/style.styl')
    .pipe(changed('assets/css/'))
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(stylus({ use: [nib(), rupture({ implicit: false })], compress: true }))
    .pipe(gulp.dest('assets/css/'))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(path.stylus, ['stylus']);
  gulp.watch(path.jade, ['templates']);
});

gulp.task('default', ['stylus', 'templates', 'watch', 'connect']);
