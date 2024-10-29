const Venta = require("../modelos/VentaModelo");
const ventasBD = require("./conexion").ventas;
const usuariosBD = require("./conexion").usuarios;
const productosBD = require("./conexion").productos;

async function validarRelacion(idUsuario, idProducto) {
    const usuario = await usuariosBD.doc(idUsuario).get();
    const producto = await productosBD.doc(idProducto).get();
    return usuario.exists && producto.exists;
}

async function mostrarVentas() {
    const ventas = await ventasBD.get(); // Obtener las ventas de la BD
    let ventasConNombres = [];

    for (let venta of ventas.docs) {
        const ventaData = venta.data();

        // Obtener el nombre del usuario usando el idUsuario de la venta
        const usuario = await usuariosBD.doc(ventaData.idUsuario).get();
        const nombreUsuario = usuario.exists ? usuario.data().nombre : "Usuario no encontrado";

        // Obtener el nombre del producto usando el idProducto de la venta
        const producto = await productosBD.doc(ventaData.idProducto).get();
        const nombreProducto = producto.exists ? producto.data().producto : "Producto no encontrado";

        // Agregar los nombres al objeto de venta
        const ventaConNombres = {
            id: venta.id,                 // Incluimos el ID de la venta
            idUsuario: ventaData.idUsuario, // Podemos mantener el ID del usuario si es necesario
            nombreUsuario,                // Añadimos el nombre del usuario
            idProducto: ventaData.idProducto, // Mantener el ID del producto
            nombreProducto,               // Añadimos el nombre del producto
            cantidad: ventaData.cantidad,
            fecha: ventaData.fecha,
            hora: ventaData.hora,
            estatus: ventaData.estatus
        };

        ventasConNombres.push(ventaConNombres); // Guardamos la venta con los nombres
    }

    return ventasConNombres; // Devolvemos todas las ventas con los nombres
}

async function buscarVentaPorID(id) {
    const venta = await ventasBD.doc(id).get();
    return venta.exists ? new Venta({ id: venta.id, ...venta.data() }).getVenta : null;
}

async function nuevaVenta(data) {
    const { idUsuario, idProducto, cantidad } = data; // Solo necesitamos estos tres campos
    let ventaValida = false;

    // Validar que el usuario y el producto existen
    if (await validarRelacion(idUsuario, idProducto)) {
        const nuevaVenta = new Venta({ idUsuario, idProducto, cantidad });
        await ventasBD.doc().set(nuevaVenta.getVenta);  // Crear la nueva venta con los valores predeterminados
        ventaValida = true;
    }
    
    return ventaValida;
}

async function actualizarEstatusVenta(id) {
    const venta = await buscarVentaPorID(id);
    
    if (venta) {
        if (venta.estatus === "Cancelado") {
            // La venta ya está cancelada, no hacemos nada
            console.log("La venta ya está cancelada.");
            return { success: false, message: "La venta ya está cancelada." };
        }
        
        // Cambiamos el estatus a "Cancelado"
        await ventasBD.doc(id).update({ estatus: "Cancelado" });
        return { success: true, message: "La venta ha sido cancelada." };
    }

    // Si no se encontró la venta
    return { success: false, message: "Venta no encontrada." };
}

module.exports = {
    mostrarVentas,
    buscarVentaPorID,
    nuevaVenta,
    actualizarEstatusVenta
};
