const path = require('path');
const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
 resolve: {
 extensions: [
 '.js',
 '.jsx',
 '.json',
 '.ts',
 '.tsx'
 ]
 },
 output: {
 libraryTarget: 'commonjs', // exported as properties to module.exports
 path: path.join(__dirname, 'dist'),
 filename: '[name].js',
 pathinfo: true // include useful path info about modules, exports, requests, etc. into the generated code
 },
 target: 'node', // in order to ignore built-in modules like path, fs, etc.
 externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
 module: {
 rules: [
 // rules for modules (configure loaders, parser options, etc.)
 { test: /\.ts(x?)$/, loader: 'ts-loader' }
 ],
 },
};
