const { src, dest, parallel } = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const webpack = require('webpack-stream');

function minifyHtmlTask(cb) {
	return src([
    'src/*.html'
    ])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('output/'));
}

function minifyCssTask(cb) {
	return src([
    'src/css/*.css'
    ])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('output/'));
}

function minifyJsByWebpack(cb) {
  return src('src/js/main.js')
    .pipe(
      webpack()
    )
    .pipe(dest('output/'));
}
// function minifyTask(cb) {
//   // place code for your default task here
//   // return src([
//   //   'src/js/utils.js',
//   //   'src/js/sprite/sprite.js',
//   //   'src/js/sprite/basicSprite.js',
//   //   'src/js/sprite/textblock.js',
//   //   'src/js/sprite/*.js',
//   //   // 'src/js/character.js',
// 	// 'src/js/levelData/*.js',
// 	// // 'src/js/playerInfo.js',
// 	// // 'src/js/gameDataManager.js',
//   // //   'src/js/moveLibrary.js',
//   // //   'src/js/battleField.js',
//   //   'src/js/scene/scene.js',
//   //   'src/js/scene/titleScene.js',
// 	//   'src/js/scene/*.js',
//   //   'src/js/game.js',
//   //   'src/js/main.js',
//   //   'src/js/**/*.js'
//   //   ])
//     return src('src/js/main.js')
//     .pipe(concat('scripts.js'))
//     .pipe(terser({
//       mangle: {
//         toplevel: true,
//       },
//       compress: {
//         booleans_as_integers: true,
//         drop_console: true,
//         passes: 3,
//         module: true,
//       },
//       output: {
//             beautify: false,
//         },
//     }))
//     .pipe(dest('output/'));
// }


function concatTask(cb) {
  // place code for your default task here
  return src('src/js/**/*.js')
    .pipe(concat('scripts-concat.js'))
    .pipe(dest('output/'));
}


exports.minify = parallel(minifyHtmlTask, minifyCssTask, minifyJsByWebpack)
/*exports.minify = minifyTask*/
exports.concat = concatTask
// exports.minifyT1 = minifyTaskTest1
// exports.minifyT2 = minifyTaskTest2

