import nib from 'nib';
import gulp from 'gulp';
import jeet from 'jeet';
import rupture from 'rupture';
import babelify from 'babelify';
import browserify from 'browserify';
import browserSync from 'browser-sync';
import plugins from 'gulp-load-plugins';
import pngquant from 'imagemin-pngquant';
import source from 'vinyl-source-stream';

const $ = plugins();
const server = browserSync.create();

const path = {
  js: ['assets/js/**/*.js', '!assets/js/**/*.min.js'],
  jsEntry: ['assets/js/main.js'],
  stylus: ['assets/stylus/**/*.styl'],
  css: ['assets/css/**/*.css', '!assets/css/**/*.min.css'],
  img: ['assets/img/**/*.*'],
  imgSprite: ['assets/img/sprites/*.*'],
  imgSpriteSVG: ['assets/img/vectors/*.svg'],
  pug: ['assets/pug/**/*.pug', 'assets/pug/layouts/*.pug', 'assets/pug/includes/*.pug'],
  pugCompile: ['assets/pug/**/*.pug', '!assets/pug/layouts/*.pug', '!assets/pug/includes/*.pug'],
  html: ['**/*.html']
}

gulp.task('browserify', () =>
  browserify(path.jsEntry)
    .transform('babelify')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('assets/js/'))
    .pipe(server.stream())
);

gulp.task('spritesvg', () =>
  gulp.src(path.imgSpriteSVG)
    .pipe($.svgSymbols({
      templates: ['default-svg']
    }))
    .pipe(gulp.dest('assets/img/'))
);

gulp.task('sprite', () => {
  const spriteData = 
    gulp.src(path.imgSprite)
    .pipe($.spritesmith({
      imgPath: '../img/sprite.png',
      imgName: 'sprite.png',
      cssName: 'sprite.styl',
      cssFormat: 'stylus',
      algorithm: 'binary-tree'
    }));

  spriteData.img.pipe(gulp.dest('assets/img/'));
  spriteData.css.pipe(gulp.dest('assets/stylus/core/'));
});

gulp.task('templates', () => {
  const LOCALS = {
    title: "Project Title"
  };
 
  gulp.src(path.pugCompile)
    .pipe($.pug({
      locals: LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./'))
    .pipe(server.stream())
});

gulp.task('imagemin', () =>
  gulp.src(path.img)
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(path.img))
);

gulp.task('stylus', () =>
  gulp.src('assets/stylus/style.styl')
    .pipe($.changed('assets/css/'))
    .pipe($.plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe($.stylus({ use: [nib(), rupture({ implicit: false }), jeet()], compress: false }))
    .pipe(gulp.dest('assets/css/'))
    .pipe(server.stream())
);

gulp.task('serve', () =>
  server.init({
    server: {
      baseDir: "./"
    }
  })
);

gulp.task('watch', () => {
  gulp.watch(path.stylus, ['stylus']);
  gulp.watch(path.jsEntry, ['browserify']);
  gulp.watch(path.pug, ['templates']);
});

gulp.task('default', ['stylus', 'templates', 'browserify', 'watch', 'serve']);
