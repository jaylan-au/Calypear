var gulp = require('gulp');


gulp.task('styles',function(){
  gulp.src([
    'node_modules/skeleton-css/css/*',
    'node_modules/easy-autocomplete/dist/easy-autocomplete.min.css',
    'node_modules/pikaday/css/pikaday.css',
    'server/www/css/*'
    ])
    .pipe(gulp.dest('server/dist/css'));
});

gulp.task('scripts',function(){
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/d3/build/d3.js',
    'node_modules/easy-autocomplete/dist/jquery.easy-autocomplete.js',
    'node_modules/file-saver/FileSaver.js',
    'node_modules/canvas-toBlob/canvas-toBlob.js',
    'node_modules/pikaday/pikaday.js',
    'server/www/js/*',
    'plugins/calypear-vis/www/js/*'
  ])
  .pipe(gulp.dest('server/dist/js'));
});

gulp.task('watch',function(){
  //Only need to watch calypear specific files
  gulp.watch('server/www/css/*',['styles']);
  gulp.watch('server/www/js/*',['scripts']);
  gulp.watch('plugins/calypear-vis/www/js/*',['scripts']);
});


gulp.task('default', ['styles', 'scripts']);
