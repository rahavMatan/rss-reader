var gulp = require('gulp'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create();

//const server = browserSync.create();

var config = {
  jsLibs : ['node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js',
            'node_modules/angular/angular.js',
            'node_modules/angular-resource/angular-resource.js',
             'node_modules/angular-route/angular-route.js'] ,

  bootstrapCss:'node_modules/bootstrap/dist/css/bootstrap.min.css',
  scripts : ['app/app.js', '!app/main/*.js', 'app/**/*.js' ]
}

gulp.task('lib',function(){
  gulp.src(config.jsLibs)
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('app/main',{overwrite:true}))
})

gulp.task('scripts',function(){
  gulp.src(config.scripts)
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('app/main',{overwrite:true}))
})

gulp.task('reload',function(done){
  browserSync.reload();
  done();
})

gulp.task('default', function() {
  browserSync.init({
    server: {
        baseDir: "./app"
    }
  });
  gulp.watch(['!app/main/*.js','app/**/*.js'], ['scripts','reload']);
  gulp.watch(['app/**/*.html','app/**/*.css'],['reload'])
});
gulp.task('watch', function() {
  gulp.watch(['!app/main/*.js','app/**/*.js'], ['scripts']);

});
