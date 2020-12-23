const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-bundle.js',
    publicPath: '/',
  },
  devServer: {
    publicPath: '/',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    hot: true,
    overlay: false,
    proxy: {
      '/api': 'http://localhost:3001',
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png?$/,
        use: 'file-loader'
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          filter: async (resourcePath) => {
            const filename = resourcePath.split('/').pop();

            return filename !== 'index.html';
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.ETHEREUM_NETWORK': JSON.stringify(process.env.ETHEREUM_NETWORK)
    })
  ],
};
