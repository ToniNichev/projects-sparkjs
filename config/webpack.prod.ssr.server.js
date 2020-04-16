const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack =require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const getEnvironmentConstants = require('../getEnvironmentConstants');

console.log(`Server is starting at: ${process.env.APP_HOST} ${process.env.SERVER_PORT}`);

module.exports = {
  mode: 'development',
  devtool: '',
  target: "node",
  externals: [nodeExternals()],

  entry: {
    server: './ssr-server.js'
  },

  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(__dirname, '../', 'server-build') 
  },  
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },

      // SCSS
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[folder]-[local]--[hash:base64:5]',
              },
              importLoaders: 2,              
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('autoprefixer')()],
              sourceMap: true              
            },
          },
          {
            loader: 'sass-loader',
          }
        ],
      },
      // images
      {
        test: /\.(png|jp(e*)g|svg)$/,  
        use: [{
            loader: 'url-loader',
            options: { 
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]'
            } 
        }]
      },
      //File loader used to load fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }                    
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
    }), 
    new OptimizeCSSAssetsPlugin({}),  
    // on the server we still need one bundle
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
    }),    
    new webpack.DefinePlugin({ 'process.env' : getEnvironmentConstants() } ),  
  ]
};