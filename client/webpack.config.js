const webpack = require('webpack');
// этот файл - инструмент сборки
const path  = require('path')
// const HTMLWebpackPlugin = require('html-webpack-plugin') // работай с html
const { CleanWebpackPlugin } = require('clean-webpack-plugin') // очистка кеша
// const CopyWebpackPlugin = require('copy-webpack-plugin') // копируй-перетаскивай
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // работай с css (вставляй стили в файл css)
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin') // минифицируй css
const TerserWebpackPlugin = require('terser-webpack-plugin') // минифицируй js
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin') // через него прикрутить externals с массивом объектов, содержащих урлы с cdn библтотек

const isDev = process.env.NODE_ENV === 'development' // определяй в каком сейчас режиме
const isProd = !isDev                                //

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const filename = ext => `[name].${ext}`; // isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders  = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // hrm: isDev,                                               // hot module replacement // изменяй определенные сущности без перезагрузки страницы
                // reloadAll: true,
                // publicPath: '/', // isDev ? '../../' : '/wp-content/themes/fas/'
            },
        },
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // Options
                    },
                  ],
                ],
              },
            }
        }
    ]                                                                     // свой style-loader в комплекте

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const babelOptions = (preset) => {
    const opts = {
        presets: [
            '@babel/preset-env',
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}

const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: babelOptions()
        }
    ]

    return loaders
}

//
module.exports = {
    context: path.resolve(__dirname, 'src'),                                // со всех путях  удаляю эту папку
    mode: 'development',
    entry: {                                                                // точка входа в приложение, откуда начать
        main: [
            '@babel/polyfill',
            './js/main.js'
        ],
    },
    output: {                                                               // куда складывать результаты работы
        filename: 'js/' + filename('js'),                                   // итоговый файл, после сборкивсех js файлов
        path: path.resolve(__dirname, 'public'),                              // отталкиваясь от текущей директории, складывать все в public
        publicPath: '/'                                                     // относительная ссылка, которая будет подставляться из браузера
    },
    resolve: {
        extensions: [                                                       // какие расширения нужно понимать по умолчанию
            '.js', '.json', '.png',
        ],
       alias: {
           '@': path.resolve(__dirname, 'src')                              // путь до корня проекта
       }
    },
    // optimization: optimization(),
    devServer: {
        overlay: true,                                                       // вывод ошибок на экранб в браузер
        port: 4200,
        hot: isDev,                                                          // если разработка - true, должна быть
        historyApiFallback: true,                                            // отдаем по любому url главный html файл - index.html
    },
    devtool: isDev ? 'source-map' : 'eval',
    externals: {},
    plugins: [
        // new HTMLWebpackPlugin({
        //     filename: 'index.html',
        //     template: './templates/main-page.html',
        //     minify: {
        //         collapseWhitespace: !isProd
        //     },
        //     inject: true,
        // }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, './src/images/**/*').replace(/\\/g, "/"), // в win пути с другими слэшами
        //             to: path.resolve(__dirname, './public/'),
        //         },
        //     ]
        // }),
        new MiniCssExtractPlugin({
            filename: 'css/' + filename('css')                            // filename('css') // 'assets/css/' + filename('css')
        }),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //       NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        //       CUSTOM_URL_TO_BACK_ENV: JSON.stringify(process.env.CUSTOM_URL_TO_BACK_ENV),
        //     }
        // })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    },
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                use: [
                    'json-loader',
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
        ]
    },
    stats: {
      colors: true,
      reasons: true,
    }
}