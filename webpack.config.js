const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(path.join(__dirname, 'src', 'main.js')),
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
        ],
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
        open: true,
        port: 18000,
    },
};
