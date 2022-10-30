const { conexion } = require("./basedatos/conexion")
const express = require("express")
const cors = require("cors")

// Inicializar APP
console.log("App de node arrancada");

// Conectar a la base de datos
conexion()

//Crear servidor Node
const app = express()
const puerto = 3900

// Configurar CORS
app.use(cors())

// Convertir body a objeto js
app.use(express.json()) // recibir datos con content-type app/json 
app.use(express.urlencoded({extended:true})) //recibiendo datos que llegan por form-urlencoded

//RUTAS
const rutas_articulo = require("./rutas/articulo")

// Cargo las rutas
app.use("/api", rutas_articulo)

// RUTAS DE PRUEBA A PIÑON
app.get("/probando", (req, res) => {
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
})

app.get("/", (req, res) => {
    
    return res.status(200).send(
        "<h1>Empezando a crear una api rest con node</h1>"
    )
})

// Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto " + puerto)
})