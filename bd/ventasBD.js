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
    
    if (venta.exists) {
        const ventaData = venta.data();
        
        // Obtener los nombres del usuario y producto
        const usuarioRef = usuariosBD.doc(ventaData.idUsuario);
        const productoRef = productosBD.doc(ventaData.idProducto);
        
        // Obtener los datos del usuario y del producto
        const usuarioDoc = await usuarioRef.get();
        const productoDoc = await productoRef.get();
        
        // Agregar los nombres al objeto de la venta
        if (usuarioDoc.exists) {
            ventaData.nombreUsuario = usuarioDoc.data().nombre;
        } else {
            ventaData.nombreUsuario = null; // O lo que consideres si no se encuentra el usuario
        }

        if (productoDoc.exists) {
            ventaData.nombreProducto = productoDoc.data().producto;
        } else {
            ventaData.nombreProducto = null; // O lo que consideres si no se encuentra el producto
        }

        // Crear el objeto de la venta con los nombres
        return new Venta({ id: venta.id, ...ventaData }).getVenta;
    } else {
        return null;
    }
}


async function nuevaVenta(data) {
    const { nombreUsuario, nombreProducto, cantidad } = data;

    // Obtener el ID del usuario a partir del nombre
    const usuario = await usuariosBD.where("nombre", "==", nombreUsuario).get();
    let idUsuario = null;
    if (!usuario.empty) {
        idUsuario = usuario.docs[0].id;  // Obtener el ID del primer usuario encontrado
        console.log(`ID de Usuario obtenido: ${idUsuario}`);
    } else {
        console.log(`No se encontró usuario con nombre: ${nombreUsuario}`);
        return false;
    }

    // Obtener el ID del producto a partir del nombre
    const producto = await productosBD.where("producto", "==", nombreProducto).get();
    let idProducto = null;
    if (!producto.empty) {
        idProducto = producto.docs[0].id;  // Obtener el ID del primer producto encontrado
        console.log(`ID de Producto obtenido: ${idProducto}`);
    } else {
        console.log(`No se encontró producto con nombre: ${nombreProducto}`);
        return false;
    }

    // Validar que los IDs existen y crear la venta
    if (idUsuario && idProducto && await validarRelacion(idUsuario, idProducto)) {
        const nuevaVenta = new Venta({ idUsuario, idProducto, cantidad });
        console.log("Datos de la venta antes de guardarla:", nuevaVenta.getVenta); // Muestra los datos de la venta
        await ventasBD.doc().set(nuevaVenta.getVenta);
        console.log("Venta creada exitosamente.");
        return true;
    } else {
        console.log("No se pudo crear la venta. Verifica que el usuario y el producto existan.");
        return false;
    }
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

async function editarVenta(id, data) {
    const { nombreUsuario, nombreProducto, cantidad } = data;

    //verificar si la venta existe
    const ventaExistente = await ventasBD.doc(id).get();
    if (!ventaExistente.exists) {
        console.log(`No se encontró la venta con ID: ${id}`);
        return { success: false, message: "Venta no encontrada" };
    }

    // Verificar si la venta está cancelada
    const ventaData = ventaExistente.data();
    if (ventaData.estatus === "Cancelado") {
        console.log("No se puede editar una venta cancelada");
        return { success: false, message: "No se puede editar una venta cancelada" };
    }

    // Obtener el ID del usuario a partir del nombre
    let idUsuario = null;
    if (nombreUsuario) {
        const usuario = await usuariosBD.where("nombre", "==", nombreUsuario).get();
        if (!usuario.empty) {
            idUsuario = usuario.docs[0].id;
            console.log(`ID de Usuario obtenido: ${idUsuario}`);
        } else {
            console.log(`No se encontró usuario con nombre: ${nombreUsuario}`);
            return { success: false, message: "Usuario no encontrado" };
        }
    }

    // Obtener el ID del producto a partir del nombre
    let idProducto = null;
    if (nombreProducto) {
        const producto = await productosBD.where("producto", "==", nombreProducto).get();
        if (!producto.empty) {
            idProducto = producto.docs[0].id;
            console.log(`ID de Producto obtenido: ${idProducto}`);
        } else {
            console.log(`No se encontró producto con nombre: ${nombreProducto}`);
            return { success: false, message: "Producto no encontrado" };
        }
    }

    const actualizaciones = {};
    if (idUsuario) {
        actualizaciones.idUsuario = idUsuario;
    }
    
    if (idProducto) {
        actualizaciones.idProducto = idProducto;
    }
    
    if (cantidad) {
        actualizaciones.cantidad = cantidad;
    }

    // Si no hay nada que actualizar, retornar
    if (Object.keys(actualizaciones).length === 0) {
        return { success: false, message: "No se proporcionaron datos para actualizar" };
    }

    try {
        await ventasBD.doc(id).update(actualizaciones);
        console.log("Venta actualizada exitosamente");
        return { success: true, message: "Venta actualizada exitosamente" };
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        return { success: false, message: "Error al actualizar la venta" };
    }
}


module.exports = {
    mostrarVentas,
    buscarVentaPorID,
    nuevaVenta,
    actualizarEstatusVenta,
    editarVenta
};
