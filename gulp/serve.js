const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const argv = require("yargs").argv;

gulp.task("serve", function () {
  let port = argv.p || 3000;
  browserSync.init({
    port: port,
    files: ["./js/*.js"],
    server: {
      baseDir: "./"
    }
  });

  gulp.watch([
    // "**/index.html",
    "./js/*.js"
  ]).on("change", () => browserSync.reload());

});