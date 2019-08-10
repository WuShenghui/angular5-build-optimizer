const fs = require('fs');
const path = require('path');
const { SourceMapDevToolPlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    ScriptsWebpackPlugin,
    NamedLazyChunksWebpackPlugin,
    BaseHrefWebpackPlugin
} = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin } = require('webpack').optimize;
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { NoEmitOnErrorsPlugin, NamedModulesPlugin } = require('webpack');

const os = require('os');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const nodeModules = path.join(process.cwd(), 'node_modules');
const webpackMerge = require('webpack-merge');
const {
    entryPoints,
    postcssPlugins,
    cssAssets,
    scriptAssets,
    commonConfig
} = require('./webpack.common.js');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(
    process.cwd(),
    'src',
    '$$_gendir',
    'node_modules'
);

// see: https://stackoverflow.com/a/54098693
function getArgs() {
    const args = {};
    process.argv.slice(2, process.argv.length).forEach(arg => {
        // long arg
        if (arg.slice(0, 2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2, longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1, arg.length).split('');
            flags.forEach(flag => {
                args[flag] = true;
            });
        }
    });
    return args;
}

const args = getArgs();

let proxyConfig = {};

if (args.env && fs.existsSync(args.env)) {
    try {
        const data = fs.readFileSync(args.env);
        proxyConfig = JSON.parse(data);
    } catch {
        console.error('ERROR: invalid proxy config');
    }
}

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js',
        crossOriginLoading: false
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(eot|svg|cur)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[hash:20].[ext]',
                    limit: 10000
                }
            },
            {
                test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[hash:20].[ext]',
                    limit: 10000
                }
            },
            {
                exclude: cssAssets,
                test: /\.css$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                exclude: cssAssets,
                test: /\.scss$|\.sass$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ]
            },
            {
                exclude: cssAssets,
                test: /\.less$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                exclude: cssAssets,
                test: /\.styl$/,
                use: [
                    'exports-loader?module.exports.toString()',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            sourceMap: false,
                            paths: []
                        }
                    }
                ]
            },
            {
                include: cssAssets,
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                include: cssAssets,
                test: /\.scss$|\.sass$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ]
            },
            {
                include: cssAssets,
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                include: cssAssets,
                test: /\.styl$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            import: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins,
                            sourceMap: false
                        }
                    },
                    {
                        loader: 'stylus-loader',
                        options: {
                            sourceMap: false,
                            paths: []
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: 'happypack/loader?id=ts'
            }
        ]
    },

    plugins: [
        // new CleanWebpackPlugin(),
        new HappyPack({
            id: 'ts',
            threads:
                os.cpus().length -
                1 /* at least 1 cpu for the fork-ts-checker-webpack-plugin */,
            loaders: [
                {
                    loader: 'angular-router-loader',
                    options: {
                        debug: true,
                        loader: 'system'
                    }
                },
                {
                    loader: 'angular2-template-loader'
                },
                {
                    path: 'ts-loader',
                    query: {
                        configFile: 'tsconfig.json',
                        happyPackMode: true
                    }
                },
                {
                    loader: '@angular-devkit/build-optimizer/webpack-loader',
                    options: {
                        sourceMap: false
                    }
                }
            ]
        }),
        new HardSourceWebpackPlugin({
            cacheDirectory: path.join(
                process.cwd(),
                'node_modules/.cache/hard-source/[confighash]'
            ),
            info: {
                mode: 'none',
                level: 'debug'
            }
        }),
        new NoEmitOnErrorsPlugin(),
        new ScriptsWebpackPlugin({
            name: 'scripts',
            sourceMap: true,
            filename: 'scripts.bundle.js',
            scripts: scriptAssets,
            basePath: process.cwd()
        }),
        new CopyWebpackPlugin(
            [
                {
                    context: 'src',
                    to: '',
                    from: {
                        glob: path.join(process.cwd(), 'src\\assets\\**\\*'),
                        dot: true
                    }
                },
                {
                    context: 'src',
                    to: '',
                    from: {
                        glob: path.join(process.cwd(), 'src\\favicon.ico'),
                        dot: true
                    }
                }
            ],
            {
                ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
                debug: 'warning'
            }
        ),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            exclude: /(\\|\/)node_modules(\\|\/)/,
            failOnError: false,
            onDetected: false,
            cwd: process.cwd()
        }),
        new NamedLazyChunksWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src\\index.html',
            filename: './index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: false,
            cache: true,
            showErrors: true,
            chunks: 'all',
            excludeChunks: [],
            title: 'Webpack App',
            xhtml: true,
            chunksSortMode: function sort(left, right) {
                let leftIndex = entryPoints.indexOf(left.names[0]);
                let rightindex = entryPoints.indexOf(right.names[0]);
                if (leftIndex > rightindex) {
                    return 1;
                } else if (leftIndex < rightindex) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }),
        new BaseHrefWebpackPlugin({}),
        new CommonsChunkPlugin({
            name: ['inline'],
            minChunks: null
        }),
        new CommonsChunkPlugin({
            name: ['vendor'],
            minChunks: module => {
                return (
                    module.resource &&
                    (module.resource.startsWith(nodeModules) ||
                        module.resource.startsWith(genDirNodeModules) ||
                        module.resource.startsWith(realNodeModules))
                );
            },
            chunks: ['main']
        }),
        new SourceMapDevToolPlugin({
            filename: '[file].map[query]',
            moduleFilenameTemplate: '[resource-path]',
            fallbackModuleFilenameTemplate: '[resource-path]?[hash]',
            sourceRoot: 'webpack:///'
        }),
        new CommonsChunkPlugin({
            name: ['main'],
            minChunks: 2,
            async: 'common'
        }),
        new NamedModulesPlugin({}),
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            platform: 0,
            hostReplacementPaths: {
                'environments\\environment.ts': 'environments\\environment.ts'
            },
            sourceMap: true,
            tsConfigPath: 'src\\tsconfig.app.json',
            skipCodeGeneration: true,
            compilerOptions: {}
        })
    ],

    devServer: {
        historyApiFallback: true,
        proxy: proxyConfig
    }
});
