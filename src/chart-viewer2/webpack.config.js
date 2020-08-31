/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'chart-viewer2/app': path.join(__dirname, 'app.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр графиков',
            templateContent: '<canvas id="myChart"></canvas>',
            chunks: ['chart-viewer2/app'],
            filename: 'chart-viewer2/index.html',
        }),
    ],
    externals: {
        moment: 'moment'
    },
};