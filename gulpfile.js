const gulp = require('gulp');
const tsPipeline = require('gulp-webpack-typescript-pipeline');
const path = require('path');

tsPipeline.registerBuildGulpTasks(
    gulp,
    {
        entryPoints: {
            index: path.join(__dirname, 'src', 'game', 'index.ts')
        },
        outputDir: path.join(__dirname, 'src', 'public', 'js')
    }
);