const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const dotenv = require('dotenv-webpack');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new dotenv()
	],

	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 8080,
		hot: true,
		inline: true,
		progress: true,
		compress: true,
		historyApiFallback: true
	}
});
