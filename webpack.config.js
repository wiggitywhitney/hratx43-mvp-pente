var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    path: DIST_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  module : {
    rules: [
      {
        test:/\.(js|jsx)$/,
        exclude: /node_modules/,
        use:[
          {
            loader: 'babel-loader',
            options: {
              presets: ['react']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: 'css-loader'
      },
    ]
  }
};

// module.exports = {
//   entry: './src/index.js',
//   target: 'node',
//   mode: 'development',
//   module: {
//     rules: [
//       {
//         test:/\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use:['babel-loader']
//       }
//     ]
//   },
//   resolve: {
//     extensions: ['*', '.js', '.jsx']
//   },
//   output: {
//     path: __dirname + '/dist',
//     publicPath: '/',
//     filename: 'bundle.js'
//   },
//   devServer: {
//     contentBase: './dist'
//   },
//   plugins: [
//     new HtmlWebPackPlugin({
//       template: "./src/index.html",
//       filename: "./index.html"
//     })
//   ]
// };