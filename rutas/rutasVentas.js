var rutas = require("express").Router();
// var {Router} = require("express");
var { mostrarVentas,buscarVentaPorID, nuevaVenta, actualizarEstatusVenta, editarVenta } = require("../bd/ventasBD");

rutas.get("/", async (req, res) => {
    const ventasValidas = await mostrarVentas();
    res.json(ventasValidas);
});


rutas.get("/buscarVentaPorId/:id", async (req, res) => {
    const ventaValida = await buscarVentaPorID(req.params.id);
    res.json(ventaValida);
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

rutas.put("/editarVenta/:id", async (req, res) => {
    try {
        const resultado = await editarVenta(req.params.id, req.body);
        res.json(resultado);
    } catch (error) {
        console.error("Error al editar la venta:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error interno al procesar la edición de la venta" 
        });
    }
});

module.exports = rutas;