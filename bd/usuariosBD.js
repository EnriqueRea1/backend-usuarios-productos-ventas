const Usuario = require("../modelos/UsuarioModelo");
const usuariosBD = require("./conexion").usuarios;
const {encriptarPassword, validarPassword, usuarioAutorizado, adminAutorizado}=require("../middleware/funcionesPassword");

function validarDatos(usuario){
        var valido=false;
    if(usuario.nombre!=undefined && usuario.usuario!=undefined && usuario.password!=undefined){
        valido=true;
    }
    return valido;
}

async function mostrarUsuarios(){
    const usuarios = await usuariosBD.get();  
    usuariosValidos=[];
    usuarios.forEach(usuario =>{
        const usuario1 = new Usuario({id:usuario.id, ... usuario.data()});
        console.log(usuario1.getUsuario);
        
        if(validarDatos(usuario1.getUsuario)){
            usuariosValidos.push(usuario1.getUsuario);
        }
    }); 
    //console.log(usuariosValidos);
    
    return usuariosValidos;
    
}

async function buscarUsuarioPorID(id) {
    const usuario = await usuariosBD.doc(id).get();
    const usuario1=new Usuario({id:usuario.id,...usuario.data()});
    var usuarioValido=false;
    if(validarDatos(usuario1.getUsuario)){
        usuarioValido=usuario1.getUsuario;
    }
    return usuarioValido;
}

async function nuevoUsuario(data) {
    const {salt,hash}=encriptarPassword(data.password);
    data.password=hash;
    data.salt=salt;
    data.tipoUsuario="usuario";
    const usuario1=new Usuario(data);
    var usuarioValido=false;
    if(validarDatos(usuario1.getUsuario)){
        await usuariosBD.doc().set(usuario1.getUsuario);
        usuarioValido=true;
    }
    return usuarioValido;
}

async function borrarUsuario(id) {
    var usuarioValido = await buscarUsuarioPorID(id);
    var usuarioBorrado=false;
    if(usuarioValido){
        await usuariosBD.doc(id).delete();
        usuarioBorrado = true;
    }
    return usuarioBorrado;
}

async function actualizarUsuario(id, nombre, usuario, password) {
    const usuarios = await buscarUsuarioPorID(id);
    
    if (usuarios) {
        // Actualizamos solo el estatus
        await usuariosBD.doc(id).update({ nombre: nombre, usuario:usuario, password:password });
        return true;
    }
    return false;
}



module.exports={
    mostrarUsuarios,
    nuevoUsuario,
    borrarUsuario,
    buscarUsuarioPorID,
    actualizarUsuario
}

//revisar cuando si existe el usuario pero el usuario es incorrecto

/*data={
    nombre:"Rebeca",
    usuario:"beca",
    password:123
}
async function prueba() {
    console.log(await nuevoUsuario(data));    
}

prueba();
//buscarPorID("100");
mostrarUsuarios();*/