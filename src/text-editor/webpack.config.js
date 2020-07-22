/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoEditorPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: {
        'text-editor/app': path.join(__dirname, 'app.ts'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            scriptLoading: 'defer',
            title: 'Редактор файлов',
            templateContent: '<div id="editor"></div>',
            chunks: ['text-editor/app'],
            filename: 'text-editor/index.html',
        }),
        new MonacoEditorPlugin({
            languages: ['json', 'xml', 'python', 'html'],
        }),
    ],
};