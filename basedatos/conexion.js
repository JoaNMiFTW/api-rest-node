const mongoose = require("mongoose")

const conexion = async () => {
    try {

        mongoose.connect("mongodb://localhost:27017/blog")

        // Parametros dentro de objeto // solo en caso de aviso/ fallo
        // useNewUrlParser: true
        // useUnifiedTopology: true
        // useCreatedIndex: true

        console.log("conectados correctamente a la base de datos blog")

    } catch (error) {
        console.log(error)
        throw new Error("No se ha podido conectar a la base de datos")
    }
}

module.exports = {
    conexion
}