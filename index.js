const express = require("express");
const cors = require("cors");
const Rutas = require("./rutas/rutasUsuarios");

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use("/", Rutas);
app.use("/productos", Rutas);
app.use("/ventas", Rutas);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Servidor en http://localhost:"+port);
})