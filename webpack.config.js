/* eslint-env node */
const { merge } = require('webpack-merge');

module.exports = merge(
    require('./webpack.base.js'),
    require('./src/3d-viewer/webpack.config.js'),
    require('./src/csv-viewer/webpack.config.js'),
    require('./src/chart-viewer/webpack.config.js'),
    require('./src/chart-viewer2/webpack.config.js'),
);