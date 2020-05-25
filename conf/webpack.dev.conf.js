const webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",

  devtool: "cheap-eval-source-map",
  devServer: {
	contentBase: baseWebpackConfig.externals.paths.dist,
	// historyApiFallback: true,
	// noInfo: true,
	overlay: {
	  warnings: false,
	  errors: true
	},
	port: 8082,
	open: 'firefox',
  },
  plugins: [
	new webpack.SourceMapDevToolPlugin({
	  filename: "[file].map"
	})
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
});