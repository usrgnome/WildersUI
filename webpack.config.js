const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { Compilation, sources } = require('webpack');
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const scssFiles = fs.readdirSync('./client/src/assets/styles/').filter(function (file) {
    return file.match(/.*\.scss$/);
});
const scssEntries = scssFiles.map((filename) => {
    const filenameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
    const entryName = `style_` + filenameWithoutExtension;
    return { [entryName]: './client/src/assets/styles/' + filename };
});

module.exports = function (env) {
    const isProduction = !!env.production;
    const isDevelopment = !isProduction;

    const config = {
        target: ['web', 'es2020'],
        entry: {
            index: path.join(__dirname, 'client/src/index.ts'),
            ...Object.assign({}, ...scssEntries),
        },
        mode: isProduction ? 'production' : 'development',
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            hoist_funs: true,
                            reduce_funcs: false,
                            passes: 20,
                            drop_console: true,
                            drop_debugger: true,
                            ecma: 2020,
                            unsafe: true,
                            toplevel: true,
                        },
                        mangle: {
                            properties: {
                                reserved: ['meta', 'w', 'h'],
                            },
                        },
                        ecma: 2020,
                        toplevel: true,
                    },
                }),
            ],
        },
        module: {
            rules: [
                { // a loader loads file with matching extension no matter
                    // if it is listed in entry: or imported inside js
                    test: /\.(sc|sa|c)ss/,
                    use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
                    include: [path.resolve(__dirname, "./client/src/assets/styles")],
                  },
                {
                    test: /\.(js|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                {
                                    exclude: ['transform-typeof-symbol'],
                                },
                            ],
                            targets: {
                                chrome: '80',
                            },
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
        },
        output: {
            filename: '[contenthash].js',
            path: path.resolve(__dirname, 'client/build'),
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                inject: 'body',
                template: path.join(__dirname, 'client/src/assets/index.html'),
            }),
            new CopyPlugin({
                patterns: [
                    { from: './client/src/assets/styles/*.css', noErrorOnMissing: true },
                    { from: './client/src/assets/fonts', to: 'fonts/', noErrorOnMissing: true },
                    { from: './client/src/assets/img', to: 'img/', noErrorOnMissing: true, },
                ],
            }),
        ],
    };

    // if the process is run in development, start a proxy server to emulate the production environment
    if (isDevelopment) {
        config.devServer = {
            static: {
                directory: path.join(__dirname, 'client/build'),
            },
            compress: true,
            watchFiles: ['client/src/assets/*.html', 'client/src/assets/*/*'],
            hot: true,
            port: 8080,
            proxy: {
                '/auth': 'http://localhost:3001',
                '/api': 'http://localhost:3001',
            },
        };
    }

    return config;
};
