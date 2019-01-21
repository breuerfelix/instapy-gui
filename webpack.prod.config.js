const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'none',

	output: {
		publicPath: '/instapy-gui/'
	},

	plugins: [
		new CleanWebpackPlugin(['dist'])
	]
});
