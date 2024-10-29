var crypto = require("crypto");
function encriptarPassword(password){
    var salt=crypto.randomBytes(32).toString("hex");
    const hash = crypto.scryptSync(password,salt,100000,64,"sha512").toString("hex"); //este es el metodo para encriptar mediante la funcion scryptSync
    return{
        salt, 
        hash
    }
}

function validarPassword(password, hash, salt){
    const hashValidar = crypto.scryptSync(password,salt,100000,64,"sha512").toString("hex");
    return hashValidar==hash;
}

function usuarioAutorizado(){
    var autorizado = false;
    
    return autorizado;
}

function adminAutorizado(){
    var autorizado = false;
    
    return autorizado;
}

// encryptarPassword("hola");

module.exports={
    encriptarPassword,
    validarPassword,
    usuarioAutorizado,
    adminAutorizado
}