const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: path.join(__dirname, 'src', 'app.js'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
              test: /\.css$/i,
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Просмотр 3D',
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    }
};