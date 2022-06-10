// const pkg = require('../package.json')
const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const moment = require("moment")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
    .BundleAnalyzerPlugin // 打包分析
const TerserPlugin = require("terser-webpack-plugin") // 压缩
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// const GeneraterAssetPlugin = require('generate-asset-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const buildTime = moment().format("YYYY-MM-DD HH:mm:ss")

console.log("NODE_ENV", process.env.NODE_ENV)

const parsedArgs = require("minimist")(process.argv.slice(2))
const {
    analyzeBundle = false,  // 打包分析，例如npm run dev -- --analyzeBundle=true 可以添加打包分析
    mode = "",              // 如果是production就压缩
} = parsedArgs

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const plugins = [
    new webpack.DefinePlugin({
        ___BUILDTIME___: JSON.stringify(buildTime),
        ___NODEDEV___: JSON.stringify(process.env.NODE_ENV),
    }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, "../public/index.html"),
        filename: "dashboard/index.html",
        chunks: ["dashboard"],
        inject: 'body',
    }),
    // new GeneraterAssetPlugin({
    //     filename: 'analytics/resource/serverConfig.json',//输出到dist根目录下的serverConfig.json文件,名字可以按需改
    //     fn: (compilation, cb) => {
    //         cb(null, createJson(compilation));
    //     }
    // }),
    // new HtmlWebpackPlugin({
    //     template: path.join(__dirname, "../demo/demo.html"),
    //     filename: "demo.html",
    //     chunks: ["demo"],
    // }),
    // new HtmlWebpackPlugin({
    //     template: path.join(__dirname, "../spPage/index.html"),
    //     filename: "analytics/resource/loginBefore.html",
    //     chunks: ["spPage"],
    // }),
    // new HtmlWebpackPlugin({
    //     template: path.join(__dirname, "../test/index.html"),
    //     chunks: ["test"],
    //     filename: "test.html",
    // }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
        // 将css代码输出到dist/styles文件夹下
        filename: 'styles/chunk-[contenthash].css',
        ignoreOrder: true,
    }),
]

if (analyzeBundle) {
    plugins.push(new BundleAnalyzerPlugin())
}
const optimization = {}
if (mode === "production") { // 压缩
    optimization.minimizer = [
        new TerserPlugin({
            cache: true,
            parallel: true,
            extractComments: true,
        }),
    ]
}
// const serverConfig = require('../serverConfig.json')
// const createJson = function (compilation) {
//     serverConfig.versionString = `v${pkg.version}_${buildTime}`
//     return JSON.stringify(serverConfig)
// }
module.exports = {
    mode: "development",
    target: "web",
    devtool: false,
    entry: {
        dashboard: "./src/app/home/index.tsx",
        // spPage: "./spPage/index.tsx",
        // demo: "./demo/demo.tsx",
        // test: "./test/index.test.ts",
    },
    output: {
        path: path.resolve(
            __dirname,
            "../dist",
        ),
        filename: `analytics/resource/[name].[hash].js`,
        chunkFilename: `analytics/resource/chunk.[name].[hash].js`,
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".vue"],
    },
    module: {
        rules: [
            {
                test: /\.m\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName:
                                    "[name]__[local]--[hash:base64:5]",
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentedSyntax: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /([^\.]m|[^m])\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                indentedSyntax: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                    },
                ],
            },

            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            allowTsInNodeModules: true,
                            appendTsSuffixTo: [/\.vue$/],
                            appendTsxSuffixTo: [/\.vue$/],
                            configFile: path.join(__dirname, "../tsconfig.json")
                        },
                    },
                ],
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@vue/babel-preset-jsx"],
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.join(__dirname, "../tsconfig.json")
                        }
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|md)$/i, // md是为了解决demo中warn的问题
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            esModule: false,
                            outputPath: "analytics/resource",
                        },
                    },
                ],
            },
            // // 静态资源导出目录  原来的配置
            {
                test: /\.(woff2?|eot|ttf|otf|svg)$/,
                loader: "file-loader",
                options: {
                    outputPath: "analytics/resource", // 静态资源放置在analytics子目录下
                },
            },
            // 静态资源导出目录
            // {
            //     test: /\.(woff2?|eot|ttf|otf|svg)$/,
            //     loader: "file-loader",
            //     options: {
            //         outputPath: "/resource", // 静态资源放置在analytics子目录下
            //     },
            // },
            {
                test: /\.svg$/,
                loader: "svg-sprite-loader",
                include: [path.resolve("src/icons")],
                options: {
                    symbolId: "icon-[name]",
                },
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
        ],
    },
    node: {
        fs: "empty",
    },
    plugins,
    optimization,
    devServer: {
        hot: true,
        openPage: "http://localhost:8080/dashboard/",
    },
}