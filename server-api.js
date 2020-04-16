import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import config from './config/webpack.api.config.js';
require('dotenv').config();


const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  hot: true,
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  disableHostCheck: true,
});
server.listen(process.env.SERVER_PORT, 'localhost', function() {});