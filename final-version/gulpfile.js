var gulp = require('gulp');
var gutil = require('gulp-util');

var notify = require('gulp-notify');
var notifier = require('node-notifier');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('html', function(){
  gulp.src('./src/*.html')
  .pipe(gulp.dest('compiled'))
  .pipe(reload({stream: true}))
});

gulp.task('serve', ['build'], function(){
	browserSync({
		server: {
      baseDir: './compiled'
    }
	});
});

gulp.task('webpack-dev-server', ['build'], function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'sourcemap';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true,
      chunkModules: false
    }
  }).listen(8080, 'localhost', function(err) {
    if(err) throw new gutil.PluginError('webpack-dev-server', err);
    // if (stats.hasErrors()) {
    //   notifier.notify({
    //     title: '\u2620 Webpack build error \u2620',
    //     message: 'Check console for details',
    //     sound: 'Funk'
    //   });
    // } else {
    //   notifier.notify({
    //     title: '\u2728 Webpack build successful \u2728',
    //     message: 'Webpack complied without incident',
    //     sound: 'Pop'
    //   });
    // }
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
  });
});

gulp.task('styles', function(){
	gulp.src('./src/styles/main.scss')
	.pipe(sass())
	.pipe(autoprefixer())
	.pipe(gulp.dest('./compiled/css/'))
	.pipe(reload({stream: true}))
})

function handleErrors() {
	notify.onError({
		title: 'Compile Error',
		message: '<%= error.message %>'
	}).apply(this.args);
	this.emit('end');
};

gulp.task('js:build', function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      sourceMap: false,
      compress: { warnings: false }
    })
  );

  webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError('js:build', err);
    gutil.log('js:build', stats.toString({
      colors: true,
      chunkModules: false
    }));
    callback();
  })
});

var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'source-map';
myDevConfig.debug = true;

var devCompiler = webpack(myDevConfig);

gulp.task('js:build-dev', function(callback){
    
  devCompiler.run(function(err, stats) {
    if (err) throw new gutil.PluginError('js:build-dev', err);
    if (stats.hasErrors()) {
      notifier.notify({
        title: '\u2620 Webpack build error \u2620',
        message: 'Check console for details',
        sound: 'Funk'
      });
    } else {
      notifier.notify({
        title: '\u2728 Helenus build successful \u2728',
        message: 'Webpack complied without incident',
        sound: 'Pop'
      });
    }
    gutil.log('[js:build-dev]', stats.toString({
      colors: true,
      chunkModules: false
    }));
    callback();
  });

});

gulp.task('build', ['html', 'styles']);

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['webpack-dev-server'], function() {
  gulp.watch('./src/styles/**/*', ['styles']); // gulp watch for scss changes
  gulp.watch(['./src/**/*.js', 'src/**/*.jsx'], ['js:build-dev']);
  gulp.watch('compiled/**/*.*', function() {
    console.log('reloading');
    reload({stream: true}) });
  gulp.watch('src/*.html', ['html']); // if we change the HTML, change it
});