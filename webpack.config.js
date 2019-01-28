const { resolve } = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'entry-background': './src/background/index.ts',
    'entry-popup': './src/popup/index.ts',
    'entry-options': './src/options/index.ts'
  },
  output: {
    path: resolve(__dirname, 'dist/'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.ts']
  }
};