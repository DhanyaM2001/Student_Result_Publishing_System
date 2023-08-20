module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: 'source-map-loader',
          exclude: /node_modules\/(?!html2pdf\.js)/,
        },
        // Add other rules as needed for your project
      ],
    },
    // Other webpack configurations if required
  };
  