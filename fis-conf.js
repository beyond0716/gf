// 某些资源从构建中去除
fis.set('project.ignore', [
  'dist/**',
  'node_modules/**',
  '.git/**',
  '.svn/**',
  'fis-conf.js',
  'package.json',
  'README.md'
]);

fis.match('*', {
    release: '/static/$0'
});

fis.match('*.inline.css', {
  // 设置 release 为 FALSE，不再产出此文件
  release: false
})


// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
  spriter: fis.plugin('csssprites')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true
});

fis.match('**.less', {
  parser: fis.plugin('less'), // invoke `fis-parser-less`,
  rExt: '.css'
});

fis.match('**.sass', {
  parser: fis.plugin('sass'), // invoke `fis-parser-sass`,
  rExt: '.css'
});


fis.match('**.html', {
  // fis3-optimizer-dfy-html-minifier
  optimizer: fis.plugin('dfy-html-minifier',{
    removeComments: true, //去掉注释
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeAttributeQuotes: true,
    minifyJS: true, //压缩html内的js代码
    minifyCSS: true
  })
})

fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

// 调试
fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})