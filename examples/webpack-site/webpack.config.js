const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.[chunkhash].js", // Added hash here
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            title: "Reactive Charts: An Example",
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        host: "0.0.0.0",
        port: 3000,
        hot: true,
        open: true,
        compress: true,
    },
}
