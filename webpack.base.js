/* eslint-env node */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    output: {
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {},
                },
            },
            {
                test: /\.ttf$/,
                use: ['file-loader'],
            }
        ],
    },
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};