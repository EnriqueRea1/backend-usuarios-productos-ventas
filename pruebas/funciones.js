function saludar(){
    console.log("hola");
}

saludar();

function saludar2(nombre="Anónimo"){
    console.log("hola "+nombre);
}
saludar2("Juan Perez");


function saludar3(nombre="Anónimo"){
    var s="hola "+nombre;
    return s;
}
console.log(saludar3("Juancho"));

var saludo=(nombre)=>{
    console.log("hola "+nombre);
}
saludo("menganito");

var saludo3=nombre=>{
    var s="Hola "+nombre;
    return s; 
}
console.log(saludo3("Tenganito"));

var saludo4=nombre=>"Hola "+nombre;
console.log(saludo4("Pancracio"));

console.log(()=>"Hola");

var saludo5=function(){
    console.log("hola");
}

saludo5();

var saludo6=()=>{
    console.log("Saludo6");
}

var saludo7=(nombre)=>{
    console.log("Hola "+nombre);
}

saludo7("Bethoven", saludo6);