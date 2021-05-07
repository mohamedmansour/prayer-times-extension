const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    'entry-background': './src/background/background.ts',
    'entry-options': './src/options/options.tsx',
    'entry-popup': './src/popup/popup.tsx',
    'entry-timetable': './src/timetable/timetable.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './public/**/*',
          to({ context, absoluteFilename }) {
            return path.join(
              context,
              'dist',
              absoluteFilename.substr(context.length + 'public'.length + 1)
            )
          }
        }
      ]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: 'dist'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/i,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.ts', '.tsx']
  }
}
