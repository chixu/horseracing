const gulp = require("gulp");
const fsp = require('fs-promise');
const fs = require("fs");
const webpack = require("webpack");
const path = require('path');

let timeStamp;

function getTimeStamp() {
  if (!timeStamp)
    timeStamp = Date.now();
  return timeStamp;
}

function build(publish) {
  let config = {
    // devtool: 'inline-source-map',
    entry: "./src/app.ts",
    output: {
      filename: "app.js",
      path: path.resolve(__dirname, '../js')
    },
    // resolve: {
    //   extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    // },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      // loaders: [{
      //   test: /\.tsx?$/,
      //   loader: "ts-loader"
      // }]
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }]
    }
  };
  if (!publish) {
    config.devtool = 'inline-source-map';
  }
  return new Promise(resolve => {
    webpack(config, (err, stats) => {
      if (err) console.log('Webpack', err)

      console.log(stats.toString({ /* stats options */ }))

      resolve();
    });
  });
}

gulp.task("build", cb => {
  return build();
});

gulp.task("publish", cb => {
  return build(true);
});


function appendVersion(str) {
  return str + "?v=" + getTimeStamp();
}