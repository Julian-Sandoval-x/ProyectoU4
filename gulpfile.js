import * as dartSass from "sass";
import { src, dest, watch, series, parallel } from "gulp";
import gulpSass from "gulp-sass";
import terser from "gulp-terser";
import autoprefixer from "gulp-autoprefixer";
import notify from "gulp-notify";

const sass = gulpSass(dartSass);

// Compilar y minificar JavaScript
export function js() {
  return src("src/js/**/*.js")
    .pipe(terser())
    .pipe(dest("build/js"))
    .pipe(
      notify({ message: "JavaScript compilado y minificado", onLast: true })
    );
}

// Compilar y minificar SCSS, añadir autoprefixer y sourcemaps
export function css() {
  return src("src/scss/app.scss", { sourcemaps: true })
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(dest("build/css", { sourcemaps: "." }))
    .pipe(notify({ message: "CSS compilado y minificado", onLast: true }));
}

// Observar cambios en los archivos
export function watchFiles() {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", js);
}

// Tarea por defecto
export default series(parallel(css, js), watchFiles);
