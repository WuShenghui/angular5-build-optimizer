const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const {
    ScriptsWebpackPlugin,
    BaseHrefWebpackPlugin,
    SuppressExtractedTextChunksWebpackPlugin
} = require('@angular/cli/plugins/webpack');
const {
    CommonsChunkPlugin,
    ModuleConcatenationPlugin
} = require('webpack').optimize;
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const webpackMerge = require('webpack-merge');
const {
    entryPoints,
    postcssPlugins,
    cssAssets,
    scriptAssets,
    commonConfig
} = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
    output: {
        path: path.join(process.cwd(), 'dist'),
        filename: '[name].[chunkhash:20].bundle.js',
        chunkFilename: '[id].[chunkhash:20].chunk.js',
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
                test: /\.js$/,
                use: [
                    {
                        loader:
                            '@angular-devkit/build-optimizer/webpack-loader',
                        options: {
                            sourceMap: false
                        }
                    }
                ]
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
                loaders: ExtractTextPlugin.extract({
                    use: [
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
                    ],
                    publicPath: ''
                })
            },
            {
                include: cssAssets,
                test: /\.scss$|\.sass$/,
                loaders: ExtractTextPlugin.extract({
                    use: [
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
                    ],
                    publicPath: ''
                })
            },
            {
                include: cssAssets,
                test: /\.less$/,
                loaders: ExtractTextPlugin.extract({
                    use: [
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
                    ],
                    publicPath: ''
                })
            },
            {
                include: cssAssets,
                test: /\.styl$/,
                loaders: ExtractTextPlugin.extract({
                    use: [
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
                    ],
                    publicPath: ''
                })
            },
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                use: [
                    {
                        loader:
                            '@angular-devkit/build-optimizer/webpack-loader',
                        options: {
                            sourceMap: false
                        }
                    },
                    '@ngtools/webpack'
                ]
            }
        ]
    },

    plugins: [
        new ScriptsWebpackPlugin({
            name: 'scripts',
            sourceMap: false,
            filename: 'scripts.[hash:20].bundle.js',
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
                ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db', '*.exe'],
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
        new HtmlWebpackPlugin({
            template: './src\\index.html',
            filename: './index.html',
            hash: false,
            inject: true,
            compile: true,
            favicon: false,
            minify: {
                caseSensitive: true,
                collapseWhitespace: true,
                keepClosingSlash: true
            },
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
            name: ['main'],
            minChunks: 2,
            async: 'common'
        }),
        new ExtractTextPlugin({
            filename: '[name].[contenthash:20].bundle.css'
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new EnvironmentPlugin({
            NODE_ENV: 'production'
        }),
        new HashedModuleIdsPlugin({
            hashFunction: 'md5',
            hashDigest: 'base64',
            hashDigestLength: 4
        }),
        new ModuleConcatenationPlugin({}),
        new LicenseWebpackPlugin({
            licenseFilenames: [
                'LICENSE',
                'LICENSE.md',
                'LICENSE.txt',
                'license',
                'license.md',
                'license.txt',
                'LICENCE',
                'LICENCE.md',
                'LICENCE.txt',
                'licence',
                'licence.md',
                'licence.txt'
            ],
            perChunkOutput: false,
            outputTemplate: path.join(
                process.cwd(),
                'node_modules\\license-webpack-plugin\\output.template.ejs'
            ),
            outputFilename: '3rdpartylicenses.txt',
            suppressErrors: true,
            includePackagesWithoutLicense: false,
            abortOnUnacceptableLicense: false,
            addBanner: false,
            bannerTemplate:
                '/*! 3rd party license information is available at <%- filename %> */',
            includedChunks: [],
            excludedChunks: [],
            additionalPackages: [],
            modulesDirectories: ['node_modules'],
            pattern: /^(MIT|ISC|BSD.*)$/
        }),
        // new PurifyPlugin(),
        new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i,
            extractComments: false,
            sourceMap: false,
            cache: true,
            parallel: true,
            uglifyOptions: {
                compress: {
                    typeofs: false,
                    pure_getters: true,
                    passes: 3,
                    unused: false
                },
                output: {
                    ascii_only: true,
                    comments: false,
                    webkit: true
                },
                ecma: 5,
                warnings: false,
                ie8: false,
                mangle: {
                    safari10: true
                }
            }
        }),
        new AngularCompilerPlugin({
            mainPath: 'main.ts',
            platform: 0,
            hostReplacementPaths: {
                'environments\\environment.ts':
                    'environments\\environment.prod.ts'
            },
            sourceMap: false,
            tsConfigPath: 'src\\tsconfig.app.json',
            exclude: ['**/*.spec.ts', path.join(process.cwd(), 'src\\test.ts')],
            compilerOptions: {}
        })
    ],
    devServer: {
        historyApiFallback: true
    }
});
