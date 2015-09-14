var path = require('path')
var spawn = require('child_process').spawn
var _ = require('lodash')
var rimraf = require('rimraf')
var gulp = require('gulp')
var gulpUtil = require('gulp-util')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
var plumber = require('gulp-plumber')
var runSequence = require('run-sequence')
var sourcemaps = require('gulp-sourcemaps')
var webpack = require('webpack')
var webpackconf = require('./webpack.config')
var BrowserSync = require('browser-sync')
var browserSync

const BS_PORT = 3000
const MOT_PORT = 3003

// Clean ./build folder.
gulp.task('clean:build', function (cb) {
  rimraf('./build', cb)
})

// Copy ./public assets.
gulp.task('copy:public', function () {
  var stream = gulp
    .src('src/public/**/*')
    .pipe(gulp.dest('build'))

  if (browserSync) {
    stream = stream.pipe(browserSync.stream({match: ['**/images/*']}))
  }

  return stream
})

// Initialize browserSync.
gulp.task('browser-sync', function () {
  browserSync = BrowserSync.create()
  browserSync.init({
    port: BS_PORT,
    proxy: 'http://localhost:' + MOT_PORT,
    open: false,
    notify: false,
    files: [
      'build/**/*.html'
    ]
  })
})

// Compile LESS stylesheets.
gulp.task('build:less', function () {
  var stream = gulp.src('src/styles/*.less')
    .pipe(plumber({
      errorHandler: function (err) {
        console.error(err)
        this.emit('end')
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))

  if (browserSync) {
    stream = stream.pipe(browserSync.stream({match: '**/*.css'}))
  }

  return stream
})

// Webpack production build.
gulp.task('webpack:build', ['build'], function (cb) {
  var conf = webpackconf({production: true})

  webpack(conf, function (err, stats) {
    if (err) throw new gulpUtil.PluginError('webpack:build', err)
    gulpUtil.log('[webpack:build]', stats.toString({
      colors: true
    }))
    cb()
  })
})

// Motley task helper.
const motley = {
  instance: {},
  cmd: path.join(__dirname, 'node_modules', '.bin', 'motley'),
  args: ['-p', MOT_PORT],
  env: _.extend(process.env, {NODE_ENV: 'development'}),
  start: function (callback) {
    if (!motley.instance.pid) {
      motley.instance = spawn(motley.cmd, motley.args, {env: motley.env})
      motley.instance.stdout.pipe(process.stdout)
      motley.instance.stderr.pipe(process.stderr)
      gulpUtil.log(gulpUtil.colors.cyan('Started'), 'motley server ( PID:', motley.instance.pid, ')')
      // @todo Wait until app actually starts.
      if (callback) callback()
    } else {
      if (callback) callback()
    }
  },
  stop: function (callback) {
    if (motley.instance.pid) {
      motley.instance.on('exit', function () {
        gulpUtil.log(gulpUtil.colors.red('Stopped'), 'motley server ( PID:', motley.instance.pid, ')')
        motley.instance = {}
        if (callback) callback()
      })
      motley.instance.kill('SIGINT')
    } else {
      if (callback) callback()
    }
  },
  restart: function (callback) {
    motley.stop(function () {
      motley.start(callback)
    })
  }
}

// Motley development server.
gulp.task('motley', motley.start)

// Restart Motley server.
gulp.task('motley:restart', motley.restart)

// Watch ./public for changes.
gulp.task('watch:public', function () {
  gulp.watch('src/public/**/*', {interval: 2000}, ['copy:public'])
})

// Watch ./styles for changes.
gulp.task('watch:styles', function () {
  gulp.watch('src/styles/**/*', {interval: 300}, ['build:less'])
})

// Watch all the things.
gulp.task('watch', ['watch:public', 'watch:styles'])

// General build.
gulp.task('build', function (cb) {
  runSequence('clean:build', ['copy:public', 'build:less'], cb)
})

// Production
gulp.task('build-prod', ['webpack:build'])

// Default (Development)
gulp.task('default', function (cb) {
  runSequence('build', 'browser-sync', 'motley', 'watch', cb)
})
