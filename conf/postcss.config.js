module.exports = {
    plugins: [
      require('autoprefixer'),
      require('css-mqpacker'),
      require('postcss-short')({
        skip: "-",
      }),
      require('cssnano')({
        preset: [
          'default', {
            discardComments: {
              removeAll: true,
            }
          }
        ]
      })
    ]
  }