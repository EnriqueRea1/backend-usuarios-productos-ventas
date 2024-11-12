var rutas = require("express").Router();
// var {Router} = require("express");

var {mostrarUsuarios, nuevoUsuario, borrarUsuario, buscarUsuarioPorID, actualizarUsuario, login} = require("../bd/usuariosBD");


rutas.post("/login", async(req, res)=>{
    const sesionValida = await login(req, req.body.usuario, req.body.password);
    res.json(sesionValida);
    res.end();
});


rutas.get("/",async(req,res)=>{
    var usuarioValido = await mostrarUsuarios();
    res.json(usuarioValido);
});



rutas.get("/buscarUsuarioPorId/:id",async(req,res)=>{
    var usuarioValido = await buscarUsuarioPorID(req.params.id);
    res.json(usuarioValido);
});




rutas.delete("/borrarUsuario/:id",async(req,res)=>{
    var usuarioBorrado = await borrarUsuario(req.params.id);
    res.json(usuarioBorrado);
});


rutas.post("/nuevoUsuario",async(req,res)=>{
    var usuarioValido = await nuevoUsuario(req.body);
    res.json(usuarioValido);
});


rutas.patch("/actualizarUsuario/:id", async (req,res)=>{
    const {nombre, usuario, password} = req.body;
    const usuarioEditado = await actualizarUsuario(req.params.id, nombre, usuario, password);
    res.json(usuarioEditado); 
});


module.exports = rutas;