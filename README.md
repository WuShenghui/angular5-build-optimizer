# angular5-build-optimizer

improve angular(5) build performance with webpack, 3.x faster!

## Cache && Parallel

webpack.prod.js

``` 
new UglifyJsPlugin({
   cache: true,
   parallel: true,
   ...
})
```

webpack.dev.js

```
new HappyPack({
   id: 'ts',
   threads: os.cpus().length - 1 /* at least 1 cpu for the fork-ts-checker-webpack-plugin */,
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
```

## ignore large files

webpack.prod.js

```
new CopyWebpackPlugin([
  ...
],
{
  ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db', '*.exe'],
  debug: 'warning'
}
```

## License

#### [MIT](./LICENSE)
