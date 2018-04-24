const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const tsPipeline = require('gulp-webpack-typescript-pipeline');

// set up TypeScript + Webpack tasks
tsPipeline.registerBuildGulpTasks(
    gulp,
    {
        entryPoints: {
            index: path.join(__dirname, 'src', 'game', 'index.ts')
        },
        outputDir: path.join(__dirname, 'src', 'public', 'js')
    }
);

// compile Sass
gulp.task('sass', () => {
    return gulp.src(path.join(__dirname, 'src', 'scss', '**', '*.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(path.join(__dirname, 'src', 'public', 'css')));
});

// Listen for file changes to compile Sass
gulp.task('sass:watch', () => {
    gulp.watch(path.join(__dirname, 'src', 'scss', '**', '*.scss'), ['sass']);
});

// TypeScript tasks
gulp.task('ts', ['tsPipeline:build:dev']);
gulp.task('ts:prod', ['tsPipeline:build:release']);
gulp.task('ts:watch', ['tsPipeline:watch']);

// general tasks
gulp.task('dev', ['sass', 'sass:watch', 'ts:watch']);
gulp.task('prod', ['sass', 'lint', 'ts:prod']);
gulp.task('default', ['dev']);