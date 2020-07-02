/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    entry: {
        '3d-viewer/app': path.join(__dirname, 'src', '3d-viewer', 'app.ts'),
        'csv-viewer/app': path.join(__dirname, 'src', 'csv-viewer', 'app.ts'),
        'chart-viewer/app': path.join(__dirname, 'src', 'chart-viewer', 'app.ts'),
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
            {
                test: /\.ts$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: { }
                }
            }
        ],
    },
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр 3D',
            chunks: ['3d-viewer/app'],
            filename: '3d-viewer/index.html',
        }),
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр CSV',
            templateContent: '<span class="message">Загрузка файла...</span><table class="main-table"></table>',
            chunks: ['csv-viewer/app'],
            filename: 'csv-viewer/index.html',
        }),
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр графиков',
            templateContent: '<div id="chart"></div>',
            chunks: ['chart-viewer/app'],
            filename: 'chart-viewer/index.html',
        }),
        new MiniCssExtractPlugin(),
        new MomentLocalesPlugin({
            localesToKeep: ['ru'],
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    }
};