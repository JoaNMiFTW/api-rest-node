const fs = require("fs")
const path = require("path")
const { validarArticulo } = require("../helpers/validar")
const Articulo = require("../modelos/Articulo")


const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba en mi controlado de articulos"
    })
}

const curso = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando")

    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "Joanmi",
            url: "joanmi.dev/master-react"
        },
        {
            curso: "Master en React",
            autor: "Joanmi",
            url: "joanmi.dev/master-react"
        }
    ])
}

const crear = (req, res) => {

    // Recoger los parametros por post a guardar
    let parametros = req.body

    // Validar datos
    try {
        validarArticulo(res, parametros)
    } catch (error) {
        return res.status(400).json({
            satus: "error",
            mensaje: "Faltan datos por enviar"
        })
    }


    // Crear el objeto a guardar
    const articulo = new Articulo(parametros)

    // Asignar valore sa objeto basado en el modelo (manual o automatico)

    // manual
    // articulo.titulo = parametros.titulo
    // articulo.contenido = parametros.contenido

    //automatico
    // const articulo = new Articulo(parametros)

    // Guardar el articulko en la base de datos
    articulo.save((error, articuloGuardado) => {

        if (error || !articuloGuardado) {
            return res.status(400).json({
                satus: "error",
                mensaje: "No se ha guardado el articulo"
            })
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articuloGuardado,
            mensaje: "Articulo guardado correctamente"
        })
    })
}

const listar = (req, res) => {

    let consulta = Articulo.find({})

    if (req.params.ultimos) {
        consulta.limit(2)
    }

    consulta.sort({ date: -1 }).exec((error, articulos) => {

        if (error || !articulos) {
            return res.status(404).json({
                satus: "error",
                mensaje: "No se han encontrado articulos"
            })
        }

        return res.status(200).json({
            status: "success",
            contador: articulos.length,
            articulos,
        })
    })
}

const uno = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id

    //Buscar el articulo
    Articulo.findById(id, (error, articulo) => {

        //Si no existe devolver error
        if (error || !articulo) {
            return res.status(404).json({
                satus: "error",
                mensaje: "No se han encontrado el articulo"
            })
        }

        //Si existe devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })
    })
}

const borrar = (req, res) => {

    let articuloId = req.params.id

    Articulo.findOneAndDelete({ _id: articuloId }, (error, articuloBorrado) => {

        if (error || !articuloBorrado) {
            return res.status(500).json({
                satus: "error",
                mensaje: "Error al borrar"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "metodo de borrar"
        })
    })
}

const editar = (req, res) => {

    //Recoger id articulo a editar
    let articuloId = req.params.id

    ///Recoger datos del body
    let parametros = req.body

    //Validar datos
    try {
        validarArticulo(parametros)
    } catch (error) {
        return res.status(400).json({
            satus: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Buscar y actualizar datos del articulo
    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true }, (error, articuloActualizado) => {

        if (error || !articuloActualizado) {
            return res.status(500).json({
                satus: "error",
                mensaje: "Error al editar"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })
    })
}

const subir = (req, res) => {

    //Configurar multer

    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            mensaje: "Petición invalida"
        })
    }

    //Conseguir nombre del archivo
    let archivo = req.file.originalname

    //Conseguir extension
    let archivoSplit = archivo.split("\.")
    let archivoExtension = archivoSplit[1]

    //Comprobar extension correcta
    if (archivoExtension != "png"
        && archivoExtension != "jpg"
        && archivoExtension != "jpeg"
        && archivoExtension != "gif") {
        // Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Imagen invalida"
            })
        })
    } else {

        //Si todo es correcto actualizar articulo

        //Recoger id articulo a editar
        let articuloId = req.params.id

        ///Recoger datos del body
        let parametros = req.body

        //Buscar y actualizar datos del articulo
        Articulo.findOneAndUpdate({ _id: articuloId }, { imagen: req.file.filename }, { new: true }, (error, articuloActualizado) => {

            if (error || !articuloActualizado) {
                return res.status(500).json({
                    satus: "error",
                    mensaje: "Error al editar"
                })
            }

            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            })
        })
    }
}

const imagen = (req, res) => {
    let fichero = req.params.fichero
    let ruta_fisica = "./imagenes/articulos/" + fichero

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica))
        } else {
            return res.status(404).json({
                satus: "error",
                mensaje: "La imagen no existe"
            })
        }
    })
}

const buscador = (req, res) => {
    //Sacar el string de busqueda
    let busqueda = req.params.busqueda

    //Find OR 
    Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } }
        ]
    })
        //Orden
        .sort({ fecha: -1 })
        //Ejecutar consulta
        .exec((error, articulosEncontrados) => {
            if (error || !articulosEncontrados || articulosEncontrados.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                })
            }

            //Devolver resultado
            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            })
        })
}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}