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
		modules: [ 'node_modules', 'src' ]
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
				test: /\.jsx?/i,
				loader: 'babel-loader',
				options: {
					presets: [
						[
							'@babel/env',
							{
								'useBuiltIns': 'entry'
							}
						]
					],
					plugins: [
						[ '@babel/plugin-transform-react-jsx', { pragma: 'h' } ],
						[ '@babel/plugin-proposal-decorators', { 'legacy': true } ],
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
