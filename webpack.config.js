var path =require('path');
module.exports = {
    entry: {
        a:'./js/a.js',
      b:'./js/b.js',
      es6:'./js/es6.js'
    },
    output: {
        path: path.resolve(__dirname,'public/build'),
        filename: '[name]-[chunkhash:8].js',
      publicPath:'http://www.cdn.com/asset/'
    }
};
