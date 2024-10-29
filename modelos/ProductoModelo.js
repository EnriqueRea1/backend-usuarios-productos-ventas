
class Producto{
    constructor(data){
        // console.log(data);
        this.id=data.id;
        this.producto=data.producto;
        this.descripcion=data.descripcion;
        this.precio=data.precio;
    }
    set id(id){
        this._id=id;
    }
 
    set producto(producto){
        this._producto=producto;
    }

    set descripcion(descripcion){
        this._descripcion=descripcion;
    }
    set precio(precio){
        this._precio=precio;
    }
    
    get id(){
        return this._id;
    }
    get producto(){
        return this._producto;
    }
    get descripcion(){
        return this._descripcion;
    }
    get precio(){
        return this._precio;
    }

    get getProducto(){
        const conid={
            id:this.id,
            producto:this.producto,
            descripcion:this.descripcion,
            precio:this.precio   
        }
        const sinid={
            producto:this.producto,
            descripcion:this.descripcion,
            precio:this.precio   
        }
        if(this.id==undefined){
            return sinid;
        }else{
            return conid;
        }
    }
}

module.exports = Producto;