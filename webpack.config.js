const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    signature: ['./src/js/main.js', './src/scss/main.scss'],
  },
  output: {
    path: __dirname + '/dist',
    filename: 'js/[name].min.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader', // Run postcss actions
            options: {
              sourceMap: true,
              plugins: function () { // postcss plugins, can be exported to postcss.config.js
                return [
                  require('autoprefixer'),
                ]
              }
            }
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader?jQuery!expose-loader?$'
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.min\.css$/g
      }),
    ]
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new MinifyPlugin({}, {
      include: /\.min\.js$/,
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*.min.*'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    })
  ]
}
