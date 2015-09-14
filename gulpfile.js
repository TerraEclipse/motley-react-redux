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
var WebpackDevServer = require('webpack-dev-server')
var webpackconf = require('./webpack-conf')
var BrowserSync = require('browser-sync')
var browserSync

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
    proxy: 'http://localhost:8080',
    open: false,
    notify: false,
    files: [
      'build/**/*.html'
    ]
  })
})

// Watch ./public for changes.
gulp.task('watch:public', function (cb) {
  gulp.watch('src/public/**/*', {interval: 2000}, ['copy:public'])
  cb()
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

// Watch ./styles for changes.
gulp.task('watch:styles', function (cb) {
  gulp.watch('src/styles/**/*', {interval: 300}, ['build:less'])
  cb()
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

// Webpack development build.
gulp.task('webpack:build-dev', ['build'], function (cb) {
  var conf = webpackconf({dev: true})
  var compiler = webpack(conf)

  compiler.run(function (err, stats) {
    if (err) throw new gulpUtil.PluginError('webpack:build-dev', err)
    gulpUtil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }))
    cb()
  })
})

// Webpack development server.
gulp.task('webpack:dev-server', function (cb) {
  var conf = webpackconf({devserver: true})
  var compiler = webpack(conf)
  var server = new WebpackDevServer(compiler, {
    contentBase: conf.output.path,
    publicPath: conf.output.publicPath,
    stats: {
      colors: true
    },
    hot: true,
    historyApiFallback: true
  })

  server.listen(8080, 'localhost', function (err) {
    if (err) throw new gulpUtil.PluginError('webpack-dev-server', err)
    gulpUtil.log('[webpack-dev-server]', 'http://localhost:8080/')
  })
})

// Motley task helper.
const motley = {
  instance: {},
  cmd: path.join(__dirname, 'node_modules', '.bin', 'motley'),
  args: ['-p', '3005'],
  env: _.extend(process.env, {NODE_ENV: 'development'}),
  start: function (callback) {
    motley.instance = spawn(motley.cmd, motley.args, {env: motley.env})
    motley.instance.stdout.pipe(process.stdout)
    motley.instance.stderr.pipe(process.stderr)
    gulpUtil.log(gulpUtil.colors.cyan('Started'), 'motley server (PID:', motley.instance.pid, ')')
    if (callback) callback()
  },
  stop: function (callback) {
    if (motley.instance.pid) {
      motley.instance.on('exit', function () {
        gulpUtil.log(gulpUtil.colors.red('Stopped'), 'motley server ( PID:', motley.instance.pid, ')')
        if (callback) callback()
      })
      return motley.instance.kill('SIGINT')
    }
    if (callback) callback()
  },
  restart: function (event) {
    motley.stop(function () {
      motley.start()
    })
  }
}

// Motley server.
gulp.task('motley', motley.start)

// General build.
gulp.task('build', function (cb) {
  runSequence('clean:build', ['copy:public', 'build:less'], cb)
})

// Watch all the things.
gulp.task('watch', ['watch:public', 'watch:styles'])

// The development server (the recommended option for development)
gulp.task('default', function (cb) {
  runSequence('build', 'browser-sync', 'watch', 'webpack:dev-server', cb)
})

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app = require(filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function (cb) {
  gulp.watch(['./src/**/*'], ['webpack:build-dev'])
})

// Production
gulp.task('build-prod', ['webpack:build'])
