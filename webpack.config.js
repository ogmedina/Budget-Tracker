const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path")


const config = {    
    entry: "./public/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },    
    plugins: [
        new WebpackPwaManifest({            
            fingerprints: false,                
            name: "Budget Tracker",
            short_name: "Budget Tracker",
            theme_color: "#ffffff",
            background_color: "#ffffff",
            start_url: "/",
            icons: [
                {
                    src: path.resolve("public/icons/icon-512x512.png"),
                    sizes: [192, 512],
                    destination: path.join("public", "icons")
                },
            ],
        }),
    ],    
};

module.exports = config;