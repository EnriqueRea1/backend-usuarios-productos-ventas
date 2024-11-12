var rutas = require("express").Router();
var {mostrarProductos, nuevoProducto, borrarProducto, buscarPorID, actualizarProducto} = require("../bd/productosBD");



rutas.get("/",async(req,res)=>{
    var productosValidos = await mostrarProductos();
    res.json(productosValidos);
});


rutas.get("/buscarProductoPorId/:id",async(req,res)=>{
    var productoValido = await buscarPorID(req.params.id);
    res.json(productoValido);
});

rutas.delete("/borrarProducto/:id",async(req,res)=>{
    var productoBorrado = await borrarProducto(req.params.id);
    res.json(productoBorrado);
});

rutas.post("/nuevoProducto",async(req,res)=>{
    var productoValido = await nuevoProducto(req.body);
    res.json(productoValido);
});

rutas.patch("/actualizarProducto/:id", async (req,res)=>{
    const {producto, precio, descripcion} = req.body;
    const productoEditado = await actualizarProducto(req.params.id, producto, precio, descripcion);
    res.json(productoEditado); 
});

module.exports = rutas;