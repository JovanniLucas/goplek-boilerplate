(function() {
    'use strict';

    // ---------------------------------------------------------------------
    // | Define dependencies to use.                                       |
    // ---------------------------------------------------------------------
    const gulp       = require('gulp');
    const concat     = require('gulp-concat');
    const rename     = require('gulp-rename');
    const uglifycss  = require('gulp-uglifycss');
    const tinypng    = require('gulp-tinypng-compress');
    const uglify     = require('gulp-uglify');
    const htmlmin    = require('gulp-htmlmin');
    const favicons   = require("gulp-favicons/es5");
    const sequence   = require('gulp-sequence');
    const styl       = require('gulp-styl');
    const livereload = require('gulp-livereload');


    const srcPath = {
        css  : 'source/design/css/',
        fonts: 'source/design/fonts/',
        imgs : 'source/design/imgs/',
        js   : 'source/design/js/',
        styl : 'source/design/styl/',
        root : 'source/'
    };

    const destPath = {
        css  : 'html/design/css/',
        fonts: 'html/design/fonts/',
        imgs : 'html/design/imgs/',
        js   : 'html/design/js/',
        root : 'html/'
    };


    // ---------------------------------------------------------------------
    // | Maintains updated src changes in the browser.                     |
    // ---------------------------------------------------------------------

    /**
     * Reload on change.
     */
    gulp.task('reload', () => {
        gulp.src(srcPath.root)
            .pipe(livereload());
    });

    /**
     * Monitors changes in projects files and apply changes instantly.
     * Use with livereload chrome extension.
     * Reference: https://github.com/vohof/gulp-livereload
     */
    gulp.task('watch', () => {
        // Files to be watched.
        let files = [
            `${srcPath.root}*.html`,
            `${srcPath.css}**/*.css`,
            `${srcPath.js}**/*.js`
        ];

        livereload.listen();

        gulp.watch(files, ['reload']);
    });


    // ---------------------------------------------------------------------
    // | Build production project.                                         |
    // ---------------------------------------------------------------------

    /**
     * Concatenate and minify css files using gulp-minify-css.
     * Reference: https://github.com/murphydanger/gulp-minify-css
     */
    gulp.task('css', () => {
        // Source files.
        let srcFiles = [
            `${srcPath.css}fonts.css`,
            `${srcPath.css}styles.css`,
            `${srcPath.css}styles-responsive.css`
        ];

        // Output file.
        let outputFile = 'styles.min.css';

        return gulp.src(srcFiles)
            .pipe(concat(outputFile))
            .pipe(uglifycss())
            .pipe(gulp.dest(destPath.css));
    });


    /**
     * Minify and copy css vendor files.
     */
    gulp.task('css-vendor', () => {
        // Source vendor files
        let srcFiles = [ `${srcPath.css}vendor/**/*.css` ];

        return gulp.src(srcFiles)
            .pipe(uglifycss())
            .pipe(gulp.dest(`${destPath.css}vendor`));
    });


    /**
     * Generate generate favicons.
     * Reference: https://github.com/haydenbleasel/favicons
     */
    gulp.task('favicon', () => {
        let opts = {
            appName: "My App",
            appDescription: "This is my application",
            developerName: "Goplek",
            developerURL: "http://goplek.com/",
            background: "transparent",
            path: "html/favicons",
            url: "http://goplek-boilerplate.com/",
            display: "standalone",
            orientation: "portrait",
            version: 1.0,
            logging: false,
            online: false,
            icons: {
                android: false,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: true,
                firefox: false,
                opengraph: false,
                twitter: false,
                windows: false,
                yandex: false
            }
        };

        return gulp.src(`${srcPath.root}favicon.png`)
            .pipe(favicons(opts))
            .pipe(gulp.dest(`${destPath.root}favicons`));
    });


    /**
     * Copy specific files from fonts folder.
     */
    gulp.task('fonts', () => {
        // Source files.
        let srcFiles = `${srcPath.fonts}*.{eot,woff,woff2,ttf,svg,otf}`;

        return gulp.src(srcFiles)
            .pipe(gulp.dest(destPath.fonts));
    });


    /**
     * Minify and create txt file from html.
     * References: https://github.com/jonschlinkert/gulp-htmlmin
     *             https://github.com/kangax/html-minifier
     */
    gulp.task('html', () => {
        // Source files.
        let srcFiles = `${srcPath.root}[!_]*.html`;

        // Opts
        let opts = {
            collapseWhitespace: true,
            removeComments: true
        };

        return gulp.src(srcFiles)
            // .pipe(htmlmin(opts))
            .pipe(rename({ extname: '.txt' }))
            .pipe(gulp.dest(destPath.root));
    });


    /**
     * Clone html files adding an underscore in name file.
     */
    gulp.task('html-dev', () => {
        // Source files.
        let srcFiles = `${srcPath.root}[!_]*.html`;

        return gulp.src(srcFiles)
            .pipe(rename({ prefix: '_' }))
            .pipe(gulp.dest(srcPath.root));
    });


    /**
     * Optimize images using gulp-tinypng-compress.
     * Reference: https://github.com/stnvh/gulp-tinypng-compress
     */
    gulp.task('imgs', () => {
        let tinyFiles  = `${srcPath.imgs}**/*.{png,jpg,jpeg}`,
            otherFiles = `${srcPath.imgs}**/*.*`;

        // Copy non png, jpg and jpeg files.
        gulp.src([otherFiles, `!${tinyFiles}`])
            .pipe(gulp.dest(destPath.imgs));


        // tinypng options
        let opts = {
            key: 'pFFAVLRIqtR-exFUo5XuSLrNAuP53k4d',
            sigFile: `${srcPath.imgs}.tinypng-sigs`,
            log: true
        };

        // Optimize tinyFiles.
        return gulp.src(tinyFiles)
            .pipe(tinypng(opts))
            .pipe(gulp.dest(destPath.imgs));
    });


    /**
     * Concatenate and minify js files.
     * References: https://github.com/terinjokes/gulp-uglify
     *             http://lisperator.net/uglifyjs/
     */
    gulp.task('js', () => {
        // Source files (avoid vendor)
        let srcFiles = [
            `!${srcPath.js}vendor/**/`,
            `${srcPath.js}**/*.js`
        ];

        // Output file.
        let outputFile = 'scripts.min.js';

        return gulp.src(srcFiles)
            .pipe(concat(outputFile))
            .pipe(uglify())
            .pipe(gulp.dest(destPath.js));
    });


    /**
     * Copy and minify js vendor files.
     */
    gulp.task('js-vendor', () => {
        // Source vendor files
        let srcFiles = [ `${srcPath.js}vendor/**/*.js` ];

        return gulp.src(srcFiles)
            .pipe(uglify())
            .pipe(gulp.dest(`${destPath.js}vendor`));
    });


    /**
     * Transpile styl files.
     * Reference: https://github.com/sindresorhus/gulp-styl
     */
    gulp.task('styl', () => {
        // Source files.
        let srcFiles = `${srcPath.styl}**/*.styl`;

        return gulp.src(srcFiles)
            .pipe(styl())
            .pipe(gulp.dest(srcPath.css));
    });


    /**
     * Build project and lave ready to deploy.
     * @param done
     */
    gulp.task('build', (done) => {
        sequence('css', 'css-vendor', 'fonts', 'imgs', 'js', 'js-vendor', 'html', 'favicon', done);
    });


    /**
     * Run default task.
     */
    gulp.task('default', ['build']);

})();