const validator = require("validator")

const validarArticulo = (parametros) => {

    let validarTitulo = !validator.isEmpty(parametros.titulo) &&
        validator.isLength(parametros.titulo, { min: 5, max: undefined })
    let validarContenido = !validator.isEmpty(parametros.contenido)

    if (!validarTitulo || !validarContenido) {
        throw new Error("No se ha validado la información")
    }
}

module.exports = {
    validarArticulo
}