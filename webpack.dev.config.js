const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const dotenv = require('dotenv-webpack');

const { PORT, ENV_FILE } = process.env;

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		ENV_FILE && new dotenv(ENV_FILE)
	],

	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: PORT || 8080,
		hot: true,
		inline: true,
		progress: true,
		compress: true,
		historyApiFallback: true
	}
});
