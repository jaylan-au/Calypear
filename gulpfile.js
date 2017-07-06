var gulp = require('gulp');


gulp.task('styles',function(){
  gulp.src(['node_modules/skeleton-css/css/*','server/www/css/*'])
    .pipe(gulp.dest('server/dist/css'))
});

gulp.task('scripts',function(){
  gulp.src('server/www/js/*')
  .pipe(gulp.dest('server/dist/js'))
});


gulp.task('default', ['styles', 'scripts']);
