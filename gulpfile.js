var gulp = require('gulp');
var pump = require('pump');
var del = require('del');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// 引入组件
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var sass = require('gulp-sass');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var htmlminify = require("gulp-html-minify");
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var copy = require('gulp-copy');
var gulpSequence = require('gulp-sequence');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');
var revCollector = require('gulp-rev-collector');
var base64 = require('gulp-base64');
var inlineSource = require('gulp-inline-source');
var livereload = require('gulp-livereload');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var buffer = require('vinyl-buffer');
var csso = require('gulp-csso');
var merge = require('merge-stream');
var spritesmith = require('gulp.spritesmith');


const babel = require('gulp-babel');
const zip = require('gulp-zip');
const filter = require('gulp-filter');

var $ = require('gulp-load-plugins')();
var webpackConfig=require('./webpack.config');

// 检查脚本
gulp.task('lint', function () {
  return gulp.src('./scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// 删除文件
gulp.task('del', function () {
  del(['./css', './js', './public']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

// 清空文件(已被弃用)
gulp.task('clean', function () {
  return gulp.src(['./css', './js', './public'], {read: false})
    .pipe(clean({force: true}));
});

// 编译Sass
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    /*.pipe(uncss({
      html: ['./html/!**!/!*.html']
    }))*/
    .pipe(autoprefixer())
    // .pipe(concat('all.css'))
    // .pipe(rename({ suffix: ".min" }))
    /*.pipe(cleanCSS({
      compatibility: 'ie8'
    }))*/
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream: true}));
});

// 编译less
gulp.task('less', function () {
  return gulp.src('./less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer())
    // .pipe(concat('all.css'))
    // .pipe(rename({ suffix: ".min" }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./css'))
    .pipe(reload({stream: true}));
    // .pipe(livereload());
});

// 合并压缩js
gulp.task('concat-uglify', function (cb) {
  pump([
      gulp.src('./scripts/**/*.js'),
      sourcemaps.init(),
      // concat('all.js'),
      // rename({ suffix: ".min" }),
      uglify(),
      sourcemaps.write('./maps'),
      gulp.dest('./js'),
      reload({stream: true})
    ],
    cb);
});

// 编译es6
gulp.task('babel', () => {
  return gulp.src('scripts/es6.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('js'));
});

// 压缩html
gulp.task('html-minify' , function(){
  return gulp.src("./html/**/*.html")
    .pipe(htmlminify())
    .pipe(gulp.dest("./public/html"))
});

gulp.task('minify', function() {
  return gulp.src('src/*.html')
      .pipe(htmlmin({
        collapseBooleanAttributes:true,
        collapseWhitespace: true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyCSS:true,
        minifyJS:true
      }))
      .pipe(gulp.dest('dist'));
});

// 压缩css
gulp.task('clean-css', function () {
  return gulp.src('./css/**/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest('./public/css'));
});

// 压缩js
gulp.task('uglify', function (cb) {
  pump([
      gulp.src('./js/**/*.js'),
      uglify(),
      gulp.dest('./public/js')
    ],
    cb);
});

// 压缩img
gulp.task('imagemin', () => {
  return gulp.src('./img/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use        : [pngquant()]
    }))
    .pipe(gulp.dest('./public/img'));
});

// 复制文件
gulp.task('copy', function () {
  return gulp.src(['./html/**/*.html', './css/**/*.css', './js/**/*.js', './font/**/*', './plugins/**/*'])
    .pipe(copy('./public'));
});

// 打包public
gulp.task('zip', () =>
  gulp.src('./public/**/*')
    .pipe(zip('public.zip'))
    .pipe(gulp.dest('./'))
);

gulp.task('useref', function () {
  return gulp.src('./html/index.html')
    .pipe(useref({
      noAssets:true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('revCss', function () {
  return gulp.src(['public/css/**.css'])
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest({
      merge: true
    }))
    .pipe(gulp.dest('dist/rev/css'));
});

gulp.task('revJs', function () {
  return gulp.src(['public/js/**.js'])
      .pipe(rev())
      .pipe(gulp.dest('dist/js'))
      .pipe(rev.manifest({
        merge: true
      }))
      .pipe(gulp.dest('dist/rev/js'));
});

gulp.task('rev-replace', function () {
  var jsFilter = filter("**/*.js",{restore: true});
  var cssFilter = filter("**/*.css",{restore: true});
  return gulp.src("./html/index.html")
    .pipe(useref())
    /*.pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))*/
    .pipe(jsFilter)
    .pipe(uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(csso())
    .pipe(cssFilter.restore)
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulp.dest('./dist'));
});

gulp.task("revreplace",  function(){
  var manifest = gulp.src(["./dist/css/rev-manifest.json","./dist/js/rev-manifest.json"]);
  return gulp.src("html/sea.config.js")
      .pipe(revReplace({manifest: manifest}))
      .pipe(gulp.dest('dist/html'));
});

gulp.task('revCollector', function () {
  return gulp.src(["./dist/css/rev-manifest.json","./dist/js/rev-manifest.json", 'html/sea.config.js'])
      .pipe( revCollector() )
      /*.pipe( minifyHTML({
        empty:true,
        spare:true
      }) )*/
      .pipe( gulp.dest('dist') );
});

// base64
gulp.task('base64', function () {
  return gulp.src('./base64/**/*.scss')
    .pipe(base64({
      baseDir: 'sass',
      extensions: ['svg', 'png', /\.jpg#datauri$/i],
      exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
      maxImageSize: 8*1024, // bytes
      debug: true
    }))
    .pipe(gulp.dest('./sass'));
});

gulp.task('inline-source', function () {
  var options = {
    compress: true
  };
  gulp.src('./html/list.html')
      .pipe(inlineSource(options))
      .pipe(gulp.dest('./out'));
});

// 生成CSS精灵图
gulp.task('sprite', function () {
  var spriteData = gulp.src('./img/sprite/*.+(jpeg|jpg|png)').pipe(spritesmith({
    imgName  : 'sprite.png',
    // imgPath  : '../img/sprite.png',
    cssName  : '_sprite.scss',
    cssTemplate:'scss.handlebars',
    // cssFormat: 'scss',
    /*cssOpts  : {
      /!*cssClass:function (item) {
       return '.icons'+item.name;
       },*!/
      cssSelector: function (item) {
        return '.sptite-' + item.name;
      }
    },*/
    padding  : 1,
    algorithm: 'binary-tree'
  }));
  var imgStream = spriteData.img
    .pipe(buffer())
    // .pipe(imagemin())
    .pipe(gulp.dest('./img'));
  var cssStream = spriteData.css
    // .pipe(csso())
    // .pipe(replace(/^\.icon-/gm, '.')) //去除默认的icon前缀
    .pipe(gulp.dest('./sass'));
  return merge(imgStream, cssStream);
  // return spriteData.pipe(gulp.dest('./spsp'));
});

// devCompiler = webpack(webpackConfig);

gulp.task("webpack", function(callback) {
  webpack(webpackConfig,function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task("webpack-dev-server", function(callback) {
  var compiler = webpack(webpackConfig);
  new WebpackDevServer(compiler, {
    // server and middleware options
  }).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    // Server listening
    gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    // keep the server alive or continue?
    // callback();
  });
});


gulp.task('livereload', function() {
  livereload.listen();
  gulp.watch('less/*.less', ['less']);
});

/*监听自动刷新*/
gulp.task('watch', function () {
  browserSync.init({
    open  : false,
    server: {
      baseDir  : "./",
      directory: true
    }
  });

  gulp.watch('./base64/**/*.scss', ['base64']);
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./less/**/*.less', ['less']);
  gulp.watch(['./scripts/**/*.js'], ['concat-uglify']);
  gulp.watch("./html/**/*.html").on('change', reload);
  gulp.watch("./font/**/*").on('change', reload);
  gulp.watch("./plugins/**/*").on('change', reload);
});

// 默认任务
gulp.task('default', gulpSequence('clean', ['sass','concat-uglify','imagemin'], 'copy','html-minify'));
gulp.task('dev', gulpSequence('clean', ['sass','concat-uglify'], 'watch'));
