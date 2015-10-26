'use strict';

var gulp = require('gulp'),
  less = require('gulp-less'),
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
  revall = require('gulp-rev-all'),
  historyApiFallback = require('connect-history-api-fallback'),
  reload = browserSync.reload,
  envify = require('envify'),
  runsequence = require('run-sequence'),
  fs = require("fs"),
  p = {
    jsx: 'scripts/index.js',
    less: 'styles/main.less',
    faFont: 'node_modules/font-awesome/fonts/**',
    bundle: 'index.js',
    distJs: 'dist/js',
    distCss: 'dist/css',
    fontDest: 'dist/fonts'
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
  var bundler = watchify(browserify(p.jsx, args));

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
  return gulp.src(p.less)
    .pipe(less())
    .on('error', notify.onError())
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

gulp.task('watchTask', function() {
  gulp.watch("styles/**/*.less", ['styles']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['browserSync', 'watchTask', 'watchify', 'styles', 'fonts']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  return gulp.start(['browserify', 'styles', 'fonts']);
});

gulp.task('default', function() {
  console.log('Run "gulp watch or gulp build"');
});

gulp.task('prepare-assets', function() {
  return gulp.src(['dist/**', 'images/**', 'index.html'], {
      base: '.'
    })
    .pipe(revall())
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

gulp.task('gh-release', function(){
  gulp.task('deploy', function() {
  return gulp.src(['./dist/**/*'])
    .pipe(ghPages());
  });
})

gulp.task('test-deploy', ['clean','browserify', 'styles', 'fonts'], function(){
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
})

gulp.task('deploy', function() {
  process.env.NODE_ENV = 'production';
  return runsequence('clean', ['browserify', 'styles', 'fonts'], 'gh-release');
});
