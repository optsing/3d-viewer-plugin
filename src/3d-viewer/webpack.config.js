/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        '3d-viewer/app': path.join(__dirname, 'app.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Просмотр 3D',
            chunks: ['3d-viewer/app'],
            filename: '3d-viewer/index.html',
        }),
    ],
};