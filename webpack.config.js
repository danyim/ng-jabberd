'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
  var config = {};
  config.entry = {
    app: './src/app.module.js'
  };

  config.resolve = {
    // Give aliases to Strophe so we can import them more easily
    alias: {
      'strophe-core': 'strophe.js/src/core',
      'strophe-bosh': 'strophe.js/src/bosh',
      'strophe-websocket': 'strophe.js/src/websocket',
      'strophe-sha1': 'strophe.js/src/sha1',
      'strophe-base64': 'strophe.js/src/base64',
      'strophe-md5': 'strophe.js/src/md5',
      'strophe-utils': 'strophe.js/src/utils',
      'strophe-polyfill': 'strophe.js/src/polyfills',
      'strophe': 'strophe.js/src/wrapper'
    },
    extensions: [
      '.js',
      '.css',
    ]
  };

  config.output = {
    path: __dirname + '/dist',
    publicPath: isProd ? '/' : 'http://localhost:8080/',
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  if (isProd) {
    config.devtool = 'source-map';
  }
  else {
    config.devtool = 'eval-source-map';
  }
  config.module = {
    rules: [
      {
        test: /\.js$/,
        loaders: ['ng-annotate-loader', 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {sourceMap: true}
          },
          {
            loader: 'postcss-loader',
            options: {
              config: './postcss.config.js',
            },
          }
        ],
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      }, {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        test: /\?fix-amd$/,
        loader: 'imports-loader?define=>false,this=>window'
      },
      {
        test: /strophejs-plugins/,
        loader: 'imports-loader?Strophe=>strophe.Strophe'
      },
      {
        test: /(bosh|websocket)\.js$/,
        loader: 'imports-loader?Strophe=>strophe.Strophe,$build=>strophe.$build,define=>false'
      }
    ]
  };

  config.plugins = [
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    }),
    // Whenever the "strophe" variable is encountered in the wild, webpack is
    // instructed to automatically load the the module
    new webpack.ProvidePlugin({
      strophe: 'strophe?fix-amd'
    }),
  ];

  config.plugins.push(
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body'
    }),

    new ExtractTextPlugin({filename: 'css/[name].css', disable: !isProd, allChunks: true})
  );

  if (isProd) {
    config.plugins.push(
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public'
      }])
    )
  }

  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
  };

  return config;
}();
