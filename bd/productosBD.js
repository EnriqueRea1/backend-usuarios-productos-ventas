const Producto = require("../modelos/ProductoModelo");
const productosBD = require("./conexion").productos;

function validarDatos(producto){
    var valido=false;
    if(producto.producto!=undefined && producto.descripcion!=undefined && producto.precio!=undefined){
        valido=true;
    }
    return valido;
}

async function mostrarProductos(){
    const productos = await productosBD.get();  
    productosValidos=[];
    productos.forEach(producto =>{
        const producto1 = new Producto({id:producto.id, ... producto.data()});
        //console.log(usuario1.getUsuario);
        if(validarDatos(producto1.getProducto)){
            productosValidos.push(producto1.getProducto);
        }
    });    
    return productosValidos;
    
}

async function buscarPorID(id) {
    const producto = await productosBD.doc(id).get();
    const producto1=new Producto({id:producto.id,...producto.data()});
    var productoValido=false;
    if(validarDatos(producto1.getProducto)){
        productoValido=producto1.getProducto;
    }
    return productoValido;
}

async function nuevoProducto(data) {
    const producto1=new Producto(data);
    var productoValido=false;
    if(validarDatos(producto1.getProducto)){
        await productosBD.doc().set(producto1.getProducto);
        productoValido=true;
    }
    return productoValido;
}

async function borrarProducto(id) {
    var productoValido = await buscarPorID(id);
    var productoBorrado=false;
    if(productoValido){
        await productosBD.doc(id).delete();
        productoBorrado = true;
    }
    return productoBorrado;
}

async function actualizarProducto(id, producto, precio, descripcion) {
    const productos = await buscarPorID(id);
    
    if (productos) {
        // Actualizamos solo el estatus
        await productosBD.doc(id).update({ producto:producto, precio:precio, descripcion:descripcion});
        return true;
    }
    return false;
}

module.exports={
    mostrarProductos,
    nuevoProducto,
    borrarProducto,
    buscarPorID, 
    actualizarProducto
}