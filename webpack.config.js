const webpack = require("webpack")
const path = require("path") 
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")  
const { browserslist } = require("./package.json")
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

module.exports = () => { 
    const plugins = [
        new webpack.DefinePlugin({
            "process.env.REGISTER_SERVICEWORKER": JSON.stringify(process.env.REGISTER_SERVICEWORKER),
            "process.env.BUILD_TIME": JSON.stringify(new Date().toISOString())
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:6].css"
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "assets/views", "index.html"),
            filename: "index.html",
        }), 
        new HTMLInlineCSSWebpackPlugin()
    ] 

    return {
        entry: { app: "./src/root.js" },
        output: {
            path: path.resolve(__dirname, "public"),
            filename: "[name].bundle.[contenthash:6].js",
            publicPath: "/"
        },
        stats: {
            hash: false,
            version: false,
            timings: false,
            children: false,
            cached: false,
            errors: true,
            assetsSpace: 1,
        },
        module: {
            rules: [
                {
                    test: /\.glsl$/,
                    loader: "webpack-glsl-loader"
                }, 
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(@huth)\/).*/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env", {
                                        targets: {
                                            browsers: browserslist
                                        }
                                    }
                                ]
                            ]
                        },
                    },
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: false,
                                postcssOptions: {
                                    path: "postcss.config.js"
                                }
                            }
                        },
                        "sass-loader"
                    ]
                }
            ]
        },
        resolve: {
            extensions: [".js"]
        },
        plugins,
    }
}