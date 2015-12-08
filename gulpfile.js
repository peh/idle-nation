'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  csso = require('gulp-csso'),
  ghPages = require('gulp-gh-pages'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  watchify = require('watchify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  babelify = require('babelify'),
  uglify = require('gulp-uglify'),
  del = require('del'),
  notify = require('gulp-notify'),
  browserSync = require('browser-sync').create(),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  RevAll = require('gulp-rev-all'),
  historyApiFallback = require('connect-history-api-fallback'),
  reload = browserSync.reload,
  envify = require('envify'),
  runsequence = require('run-sequence'),
  fs = require("fs"),
  p = {
    jsx: 'scripts/index.js',
    less: 'styles/main.less',
    scss: 'styles/main.scss',
    faFont: 'node_modules/font-awesome/fonts/**',
    bundle: 'index.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    fontDest: 'dist/fonts',
    imgSrc: 'images/**',
    imgDest: 'dist/images',
    babelOptions: {
      presets: ["es2015", "react"]
    }
  };

gulp.task('clean', function(cb) {
  return del(['dist', 'deploy'], cb);
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './',
      middleware: [historyApiFallback()]
    }
  });
});

gulp.task('watchify', function() {
  var args = watchify.args;
  args.transform = ['envify'];
  var bundler = watchify(
    browserify(p.jsx, args)
    .transform(babelify)
  )

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(p.bundle))
      .pipe(gulp.dest(p.distJs))
      .pipe(reload({
        stream: true
      }));
  }

  bundler.transform(babelify)
    .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  console.log("browserify")
  return browserify(p.jsx, {
      transform: ['envify']
    })
    .transform(babelify)
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(p.distJs));
});

gulp.task('styles', function() {
  return gulp.src(p.scss)
    .pipe(sass().on('error', notify.onError()))
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(gulp.dest(p.distCss))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('fonts', function() {
  return gulp.src(p.faFont)
    .pipe(gulp.dest(p.fontDest))
});

gulp.task('images', function() {
  return gulp.src(p.imgSrc)
    .pipe(gulp.dest(p.imgDest))
});

gulp.task('watchImages', function() {
  return gulp.watch(p.imgSrc, ['images'])
})

gulp.task('watchTask', function() {
  gulp.watch("styles/**/*.scss", ['styles']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['browserSync', 'watchTask', 'watchify', 'styles', 'fonts', 'watchImages']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  return gulp.start(['browserify', 'styles', 'fonts']);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});

gulp.task('prepare-assets', function() {
  var revAll = new RevAll();
  return gulp.src(['index.html', 'dist/**'])
        .pipe(revAll.revision())
        .pipe(gulp.dest('deploy'));
});

gulp.task('rename-index', function() {
  process.env.NODE_ENV = 'production';
  return gulp.src("deploy/index*")
    .pipe(rename({
      basename: "index",
      extname: ".html"
    }))
    .pipe(gulp.dest("deploy/"));
});

gulp.task('gh-release', function() {
  gulp.task('deploy', function() {
    return gulp.src(['./deploy/**/*'])
      .pipe(ghPages());
  });
})

gulp.task('deploy', function() {
  process.env.NODE_ENV = 'production';
  return runsequence('clean', ['browserify', 'styles', 'fonts', 'images'], 'prepare-assets', 'rename-index','gh-release');
});
