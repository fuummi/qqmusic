const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    route: "./src/js/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].js",
    publicPath: "/dist",
  },
  devServer: {
    static: {
      directory: "./src",
      watch: true,
    },
    port: 5000,
    host: "localhost",
    open: true,
    hot: true,
    proxy: {
      "/api": {
        target: "http://124.221.249.219:8000",
        pathRewrite: {
          "^/api/recommendations": "/api/recommendations",
          "^/api/ranking": "/api/ranking",
          "^/api/hot": "/api/hot",
          "^/api/search": "/api/search",
        },
      },
    },
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(png|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/,
        loader: "html-withimg-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
    }),
  ],
};
