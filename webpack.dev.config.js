const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',

	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],

	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 8080,
		hot: true,
		inline: true,
		progress: true,
		compress: true,
		historyApiFallback: true,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				pathRewrite: { '^/api': '' }
			},
			'/socket': {
				target: 'http://localhost:3001',
				pathRewrite: { '^/socket': '' },
				ws: true
			},
			'/grafana': {
				target: 'http://localhost/grafana'
			},
		}
	}
});
