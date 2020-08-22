/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'chart-viewer/app': path.join(__dirname, 'app.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр графиков',
            templateContent: '<div id="chart"></div>',
            chunks: ['chart-viewer/app'],
            filename: 'chart-viewer/index.html',
        }),
    ],
};