import babel from 'gulp-babel';

gulp.task('babel', function() {
    gulp.src('lib/index').pipe(babel({
        presets: [ 'stage-0' ]
    })).pipe(gulp.dest('dist'));
});