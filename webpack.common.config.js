const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [
		'@babel/polyfill',
		'./src'
	],

	resolve: {
		extensions: [ '.js', '.jsx' ],
		modules: [ 'node_modules', 'src' ],
		alias: {
			react: 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	performance: {
		hints: false
	},

	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.join(__dirname, 'dist'),
		publicPath: '/'
	},

	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/env',
							{
								useBuiltIns: 'entry',
								corejs: 3
							}
						]
					],
					plugins: [
						[ '@babel/plugin-transform-react-jsx', { pragma: 'h' } ],
						[ '@babel/plugin-proposal-decorators', { legacy: true } ],
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-proposal-class-properties'
					]
				}
			},
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'InstaPy GUI',
			template: path.join(__dirname, 'public/index.html')
		})
	]
};
