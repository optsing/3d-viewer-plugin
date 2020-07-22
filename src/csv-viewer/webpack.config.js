/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'csv-viewer/app': path.join(__dirname, 'app.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр CSV',
            templateContent: '<span class="message">Загрузка файла...</span><table class="main-table"></table>',
            chunks: ['csv-viewer/app'],
            filename: 'csv-viewer/index.html',
        }),
    ],
};