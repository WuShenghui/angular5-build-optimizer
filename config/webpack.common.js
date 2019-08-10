const fs = require('fs');
const path = require('path');

const rxPaths = require('rxjs/_esm5/path-mapping');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const postcssImports = require('postcss-import');

const minimizeCss = false;
const baseHref = '';
const deployUrl = '';
const projectRoot = process.cwd();

const entryPoints = [
    'inline',
    'polyfills',
    'sw-register',
    'styles',
    'scripts',
    'vendor',
    'main'
];

const postcssPlugins = function(loader) {
    // safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
    const importantCommentRe = /@preserve|@licen[cs]e|[@#]\s*source(?:Mapping)?URL|^!/i;
    const minimizeOptions = {
        autoprefixer: false,
        safe: true,
        mergeLonghand: false,
        discardComments: {
            remove: comment => !importantCommentRe.test(comment)
        }
    };
    return [
        postcssImports({
            resolve: (url, context) => {
                return new Promise((resolve, reject) => {
                    loader.resolve(context, url, (err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(result);
                    });
                });
            },
            load: filename => {
                return new Promise((resolve, reject) => {
                    loader.fs.readFile(filename, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        const content = data.toString();
                        resolve(content);
                    });
                });
            }
        }),
        postcssUrl({
            filter: ({ url }) => url.startsWith('~'),
            url: ({ url }) => {
                const fullPath = path.join(
                    projectRoot,
                    'node_modules',
                    url.substr(1)
                );
                return path
                    .relative(loader.context, fullPath)
                    .replace(/\\/g, '/');
            }
        }),
        postcssUrl([
            {
                // Only convert root relative URLs, which CSS-Loader won't process into require().
                filter: ({ url }) =>
                    url.startsWith('/') && !url.startsWith('//'),
                url: ({ url }) => {
                    if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
                        // If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
                        return `${deployUrl.replace(/\/$/, '')}${url}`;
                    } else if (baseHref.match(/:\/\//)) {
                        // If baseHref contains a scheme, include it as is.
                        return (
                            baseHref.replace(/\/$/, '') +
                            `/${deployUrl}/${url}`.replace(/\/\/+/g, '/')
                        );
                    } else {
                        // Join together base-href, deploy-url and the original URL.
                        // Also dedupe multiple slashes into single ones.
                        return `/${baseHref}/${deployUrl}/${url}`.replace(
                            /\/\/+/g,
                            '/'
                        );
                    }
                }
            },
            {
                // TODO: inline .cur if not supporting IE (use browserslist to check)
                filter: asset =>
                    !asset.hash && !asset.absolutePath.endsWith('.cur'),
                url: 'inline',
                // NOTE: maxSize is in KB
                maxSize: 10
            }
        ]),
        autoprefixer()
    ].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

const cssAssets = [
    path.join(process.cwd(), 'src\\styles.css')
];

const scriptAssets = [
    path.join(process.cwd(), 'src\\assets\\ie\\compatible.js')
];

const commonConfig = {
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['./node_modules', './node_modules'],
        symlinks: true,
        alias: rxPaths(),
        mainFields: ['browser', 'module', 'main']
    },
    resolveLoader: {
        modules: ['./node_modules', './node_modules'],
        alias: rxPaths()
    },
    entry: {
        main: ['./src\\main.ts'],
        polyfills: ['./src\\polyfills.ts'],
        styles: [
            './src\\styles.css',
            './node_modules\\font-awesome\\css\\font-awesome.min.css',
            './node_modules\\ionicons\\dist\\css\\ionicons.min.css'
        ]
    },

    node: {
        fs: 'empty',
        global: true,
        crypto: 'empty',
        tls: 'empty',
        net: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    },
    devServer: {
        historyApiFallback: true
    }
};


module.exports = {
    entryPoints,
    postcssPlugins,
    cssAssets,
    scriptAssets,
    commonConfig
};
