const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sourcemap = require('gulp-sourcemaps'),
    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    csso = require('gulp-csso'),
    rename = require('gulp-rename'),
    sync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    svgstore = require('gulp-svgstore'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify-es').default,
    pipeline = require('readable-stream').pipeline;

// Styles

const styles = () => {
    return gulp.src('src/scss/style.scss')
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer()
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(csso())
        .pipe(rename('style.min.css'))
        .pipe(sourcemap.write('.'))
        .pipe(gulp.dest('build/css'))
        .pipe(sync.stream());
}

exports.styles = styles;

// Images, WebP, Sprite

const images = () => {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,svg}')
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.mozjpeg({progressive:true}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest('src/img'));
}

exports.images = images;

const webpJPGImages = () => {
    return gulp.src('src/img/**/*.{jpg,jpeg,png}')
        .pipe(webp({quality: 95}))
        .pipe(gulp.dest('src/img'));
}

exports.webpJPGImages = webpJPGImages;

const sprite = () => {
    return gulp.src('src/img/**/icon-*.svg')
        .pipe(svgstore())
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest('build/img'));
}

exports.sprite = sprite;

// Clean

const clean = () => del('build');

exports.clean = clean;

// Copy

const copy = () => {
    return gulp.src([
        'src/fonts/**/*.{woff,woff2}',
        'src/img/**',
        'src/*.ico'
    ], {base: 'src'})
        .pipe(gulp.dest('build'));
}

exports.copy = copy;

// HTML

const html = () => {
    return gulp.src('src/*.html', {base: 'src'})
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build'))
        .pipe(sync.stream());
}

exports.html = html;

// JS

const js = () => {
    return gulp.src('src/js/**/*.js')
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('build/js'))
        .pipe(sync.stream());
}

exports.js = js;

// Build

const build = gulp.series(clean, images, webpJPGImages, copy, styles, sprite, html, js);

exports.build = build;

// Server

const server = done => {
    sync.init({
        server: {
            baseDir: 'build'
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

exports.server = server;

// Watcher

const watcher = () => {
    gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
    gulp.watch('src/*.html', gulp.series('html'));
    gulp.watch('src/js/*.js', gulp.series('js'));
}

exports.default = gulp.series(build, server, watcher);
