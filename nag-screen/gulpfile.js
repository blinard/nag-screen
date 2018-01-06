var gulp = require("gulp");
var ts = require("gulp-typescript");
var merge = require("merge2");
var del = require("del");
var child = require("child_process");
var path = require("path");

var tsProj = ts.createProject("tsconfig.json");

gulp.task("copy:coremodels", function() {
    return gulp.src("../nag-screen-models/src/**/*")
        .pipe(gulp.dest("src/core-models"));
})

gulp.task("build:ts", ["copy:coremodels"], function() {
    var tsResult = tsProj.src()
        .pipe(tsProj());
    
    return merge([
        tsResult.js.pipe(gulp.dest("dist"))
    ]);
})

gulp.task("copy:views", function() {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("dist"));
})

gulp.task("clean", function() {
    return del("dist/**/*");
})

gulp.task("build", ["build:ts", "copy:views"])

gulp.task("watch", ["build"], function() {
    gulp.watch('src/**/*', ["build", "copy:views"]);
})

gulp.task("run", ["watch"], function(cb) {
    var proc = child.spawn(path.join(__dirname, "node_modules\\electron\\dist\\electron"), ["bootstrap.js"], { stdio: "inherit", cwd: "dist" });
    cb();
    // Not waiting for completion
    proc.on("exit", function(code) {
        cb(code);
    });
})