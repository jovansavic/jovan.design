var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var minifyCSS   = require('gulp-clean-css');
var minifyjs    = require('gulp-js-minify');
var cp          = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
	browserSync.notify(messages.jekyllBuild);
	return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
	         .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

gulp.task('minify-js', function(){
	gulp.src('_scripts/main.js')
	    .pipe(minifyjs())
	    .pipe(gulp.dest('assets/scripts/'));
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'minify-js', 'jekyll-build'], function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
	return gulp.src(
		[
			'_sass/common/common.sass',
			'_sass/common/preloader.sass',
			'_sass/pages/pages.sass',
		])
	           .pipe(sass({
		           includePaths: ['sass'],
		           onError: browserSync.notify
	           }))
	           .on('error', gutil.log)
	           .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
	           .on('error', gutil.log)
	           .pipe(minifyCSS({compatibility: 'ie8'}))
	           .on('error', gutil.log)
	           .pipe(gulp.dest('_site/assets/style'))
	           .on('error', gutil.log)
	           .pipe(browserSync.reload({stream:true}))
	           .on('error', gutil.log)
	           .pipe(gulp.dest('assets/style'));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
	gulp.watch('_sass/**/*.sass', ['sass']);
	gulp.watch('_scripts/*.js', ['minify-js']);
	gulp.watch(['*.html','_pages/*.html', '_includes/**/*.html','_projects/**/*.html', '_layouts/*.html','assets/scripts/*.js','_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'minify-js', 'watch']);
