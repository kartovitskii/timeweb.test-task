const merge = require("webpack-merge"),
    baseWebpackConfig = require("./webpack.base.conf");

const {CleanWebpackPlugin} = require("clean-webpack-plugin"),
    HTMLBeautifyPlugin = require("html-beautify-webpack-plugin");

const PATHS = baseWebpackConfig.externals.paths;

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: "production",
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLBeautifyPlugin({
      config: {
        html: {
          end_with_newline: false,
          indent_size: 4,
          indent_with_tabs: true,
          indent_inner_html: true,
          preserve_newlines: true,
          unformatted: ['p', 'i', 'b', 'span']
        }
      },
    })
  ],
});

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig);
});