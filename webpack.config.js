const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
    './src/index.ts'
  ],
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'tcbAdapterQapp',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: 'typeof window !== "undefined"?window:this'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }, {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, './tsconfig.json')
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.END_POINT': JSON.stringify(process.env.END_POINT)
    })
  ]
};