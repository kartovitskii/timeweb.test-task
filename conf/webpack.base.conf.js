const path = require("path"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    copyWebpackPlugin = require("copy-webpack-plugin"),
    htmlWebpackPlugin = require("html-webpack-plugin"),
    fs = require("fs"),
    {VueLoaderPlugin} = require("vue-loader"),
    glob = require("glob-all"),
    PurgecssPlugin = require("purgecss-webpack-plugin"),
    SpriteLoaderPlugin = require("svg-sprite-loader/plugin");

const PATHS = {
  src: path.join(__dirname, "../app"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets",
  conf: path.join(__dirname, "./conf"),
};
const PAGES_DIR = `${PATHS.src}/templates/pages/`,
    PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith(".twig"));

let buildMode;
if (process.argv.some(el => el.includes("dev"))) {
  buildMode = "development";
} else {
  buildMode = "production";
}

module.exports = {
  externals: {
    paths: PATHS,
  },

  entry: {
    app: PATHS.src,
  },

  output: {
    filename: `${PATHS.assets}/js/script.[name].js`,
    path: PATHS.dist,
    publicPath: buildMode === "development" ? "/" : "/wp-content/themes/titanarena_v2/",
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          enforce: true,
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },

  resolve: {
    extensions: [".js"],
    alias: {
      "@": PATHS.src,
      "vue$": buildMode === "development" ? "vue/dist/vue.js" : "vue/dist/vue.min.js",
      "jquery$": "jquery/dist/jquery.js",
    },
  },

  module: {
    rules: [
      /** template loader*/
      {
        test: /\.twig$/,
        loader: "twig-loader",
      },
      /** style loader */
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {sourceMap: true, url: true},
          }, {
            loader: "postcss-loader",
            options: {sourceMap: true, config: {path: `${PATHS.conf}/postcss.config.js`}},
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: true,
              sourceMap: true,
            },
          }, {
            loader: "postcss-loader",
            options: {sourceMap: true, config: {path: `${PATHS.conf}/postcss.config.js`}},
          }, {
            loader: "sass-loader",
            options: {sourceMap: true},
          },
        ],
      },
      /** scripts */
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loader: {
            scss: "vue-style-loader!css-loader!sass-loader",
          },
        },
      },
      /** images */
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        exclude: [
          path.join(__dirname, "../app/fonts/"),
          path.join(__dirname, "../app/images/svg"),
        ],
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: `${PATHS.assets}/img`,
        },
      },
      {
        test: /\.svg$/,
        exclude: [
          path.join(__dirname, "../app/fonts/"),
          path.join(__dirname, "../app/images/img"),
        ],
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              extract: true,
              publicPath: `${PATHS.assets}/img/`,
            },
          },
          "svgo-loader",
        ],
      },
      /** fonts */
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: path.join(__dirname, "../app/images/"),
        loader: "file-loader",
        options: {
          name: `[folder]/[name].[ext]`,
          outputPath: `./${PATHS.assets}/fonts/`,
        },
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}/css/style.css`,
    }),
    /*new PurgecssPlugin({
      paths: () => glob.sync(`${PATHS.src}/!**!/!*`, { nodir: true }),
      content: [
        `${PATHS.src}/templates/!**!/!*.html`,
        `${PATHS.src}/templates/!**!/!*.twig`,
        `${PATHS.src}/templates/!**!/!*.vue`,
        `${PATHS.src}/js/!**!/!*.js`,
      ],
      keyframes: true,
      whitelist: collectWhitelist,
      whitelistPatterns: collectWhitelistPatterns,
      whitelistPatternsChildren: collectWhitelistPatterns,
    }),*/
    new copyWebpackPlugin([
      {from: `${PATHS.src}/images/img`, to: `${PATHS.assets}/img`},
      {from: `${PATHS.src}/video`, to: `${PATHS.assets}/video`},
      // {from: `${PATHS.src}/fonts`, to: `${PATHS.assets}/fonts`},
      {from: `${PATHS.src}/static`, to: ``},
    ]),
    new SpriteLoaderPlugin(),

    ...PAGES.map(page => new htmlWebpackPlugin({
      hash: false,
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.twig/, ".html")}`,
      inject: false,
    })),
  ],
};

function collectWhitelist() {
  // do something to collect the whitelist
  return [
    "show",
    "full",
    "swiper",
    "slider",
    "n-plan",
  ];
}

function collectWhitelistPatterns() {
  // do something to collect the whitelist
  return [
    /^show/,
    /^full/,
    /^swiper/,
    /^slider/,
    /^n-plan/,
  ];
}