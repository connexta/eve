const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "whatwg-fetch", "./client/index.js"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "target"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          "file-loader",
          {
            loader: "image-webpack-loader",
            options: {
              disable: true
            }
          }
        ]
      }
    ]
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Wallboard!!!!",
      template: "./client/index.html"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.SLACK_TOKEN": JSON.stringify(process.env.SLACK_TOKEN),
      "process.env.SLACK_CHANNEL": JSON.stringify(process.env.SLACK_CHANNEL),
      "process.env.GITHUB_CLIENT_ID": JSON.stringify(
        process.env.GITHUB_CLIENT_ID
      ),
      "process.env.GITHUB_CLIENT_SECRET": JSON.stringify(
        process.env.GITHUB_CLIENT_SECRET
      ),
      "process.env.SOAESB_LOGIN_USERNAME": JSON.stringify(
        process.env.SOAESB_LOGIN_USERNAME
      ),
      "process.env.SOAESB_LOGIN_PASSWORD": JSON.stringify(
        process.env.SOAESB_LOGIN_PASSWORD
      )
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "target"),
    compress: true,
    port: 8080,
    hot: true,
    historyApiFallback: true
  }
};
