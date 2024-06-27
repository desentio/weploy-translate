const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin'); // Add this line
const CircularDependencyPlugin = require('circular-dependency-plugin')
const webpack = require('webpack');
const packageJson = require('./package.json');
const prevVersion = packageJson.version;

module.exports = (env, argv) => {
    return {
        target: 'web',
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
                    oneOf: [
                        {
                            resourceQuery: /raw/, // foo.css?raw
                            use: [
                                'raw-loader',
                            ],
                        },
                        {
                            use: [
                                MiniCssExtractPlugin.loader,
                                'css-loader',
                            ],
                        },
                    ],
                },
                // {
                //     test: /\.css$/,
                //     exclude: /weploy\.css$/,
                //     use: 'null-loader', // Ignore other CSS files
                // },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'weploy-translate.css',
                chunkFilename: '[id].css',
            }),
            new CircularDependencyPlugin({
                // exclude detection of files based on a RegExp
                exclude: /node_modules/,
                // include specific files based on a RegExp
                include: /dir/,
                // add errors to webpack instead of warnings
                failOnError: true,
                // allow import cycles that include an asyncronous import,
                // e.g. via import(/* webpackMode: "weak" */ './file.js')
                allowAsyncCycles: false,
                // set the current working directory for displaying module paths
                cwd: process.cwd(),
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(argv.mode),
                    NO_CACHE: JSON.stringify(env.NO_CACHE),
                    BRAND: JSON.stringify('weploy'),
                    CSS_PATH: JSON.stringify('../../globalseo.css'),
                    CSS_PATH_RAW: JSON.stringify('../../globalseo.css?raw'),
                    PREV_SCRIPT_VERSION: JSON.stringify(prevVersion),
                },
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin(),
                new TerserPlugin(), // Add this line
            ],
        },
    };
};
