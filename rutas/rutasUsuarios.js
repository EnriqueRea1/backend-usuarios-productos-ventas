var rutas = require("express").Router();
// var {Router} = require("express");

var {mostrarUsuarios, nuevoUsuario, borrarUsuario, buscarUsuarioPorID, actualizarUsuario} = require("../bd/usuariosBD");
var {mostrarProductos, nuevoProducto, borrarProducto, buscarPorID, actualizarProducto} = require("../bd/productosBD");
var { mostrarVentas, buscarVentaPorID, nuevaVenta, actualizarEstatusVenta } = require("../bd/ventasBD");


rutas.get("/",async(req, res)=>{
    var usuariosValidos = await mostrarUsuarios();
    // console.log(usuariosValidos);
    res.json(usuariosValidos);
    // res.send("Hola estas en raíz");
});

rutas.get("/productos",async(req,res)=>{
    var productosValidos = await mostrarProductos();
    res.json(productosValidos);
});

rutas.get("/ventas", async (req, res) => {
    const ventasValidas = await mostrarVentas();
    res.json(ventasValidas);
});

rutas.get("/buscarUsuarioPorId/:id",async(req,res)=>{
    var usuarioValido = await buscarUsuarioPorID(req.params.id);
    res.json(usuarioValido);
});

rutas.get("/buscarProductoPorId/:id",async(req,res)=>{
    var productoValido = await buscarPorID(req.params.id);
    res.json(productoValido);
});

rutas.get("/buscarVentaPorId/:id", async (req, res) => {
    const ventaValida = await buscarVentaPorID(req.params.id);
    res.json(ventaValida);
});

rutas.delete("/borrarUsuario/:id",async(req,res)=>{
    var usuarioBorrado = await borrarUsuario(req.params.id);
    res.json(usuarioBorrado);
});

rutas.delete("/borrarProducto/:id",async(req,res)=>{
    var productoBorrado = await borrarProducto(req.params.id);
    res.json(productoBorrado);
});


rutas.post("/nuevoUsuario",async(req,res)=>{
    var usuarioValido = await nuevoUsuario(req.body);
    res.json(usuarioValido);
});

rutas.post("/nuevoProducto",async(req,res)=>{
    var productoValido = await nuevoProducto(req.body);
    res.json(productoValido);
});

rutas.post("/nuevaVenta", async (req, res) => {
    const ventaValida = await nuevaVenta(req.body);
    res.json(ventaValida);
});

rutas.patch("/actualizarEstatusVenta/:id", async (req, res) => {
    const { estatus } = req.body;   
    const ventaActualizada = await actualizarEstatusVenta(req.params.id, estatus);
    res.json(ventaActualizada);
});



rutas.patch("/actualizarUsuario/:id", async (req,res)=>{
    const {nombre, usuario, password} = req.body;
    const usuarioEditado = await actualizarUsuario(req.params.id, nombre, usuario, password);
    res.json(usuarioEditado); 
});

rutas.patch("/actualizarProducto/:id", async (req,res)=>{
    const {producto, precio, descripcion} = req.body;
    const productoEditado = await actualizarProducto(req.params.id, producto, precio, descripcion);
    res.json(productoEditado); 
});

module.exports = rutas;