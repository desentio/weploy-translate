const path = require('path');

module.exports = {
    entry: './browser.js', // Update this with your entry file
    output: {
        filename: 'weploy-translate.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: 'raw-loader',
            },
        ],
    },
};
