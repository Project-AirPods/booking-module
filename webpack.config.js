const path = require('path');

module.exports = {
  entry: path.join(__dirname, '/client/index.jsx'),
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['babel-plugin-styled-components'],
        },
      },
    ],
  },
  output: {
    filename: 'bundle-booking.js',
    path: path.join(__dirname, 'public'),
  },
};
