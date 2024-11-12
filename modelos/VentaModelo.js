class Venta {
    constructor(data) {
        this.id = data.id;
        this.idUsuario = data.idUsuario;
        this.idProducto = data.idProducto;
        this.cantidad = data.cantidad;
        this.fecha = data.fecha || new Date().toLocaleDateString();
        this.hora = data.hora || new Date().toLocaleTimeString();    
        this.estatus = data.estatus || "Vendido";  
        
        // Añadir los nombres de usuario y producto si están disponibles
        this._nombreUsuario = data.nombreUsuario || null;
        this._nombreProducto = data.nombreProducto || null;
    }

    // Setters
    set id(id) { this._id = id; }
    set idUsuario(idUsuario) { this._idUsuario = idUsuario; }
    set idProducto(idProducto) { this._idProducto = idProducto; }
    set cantidad(cantidad) { this._cantidad = cantidad; }
    set fecha(fecha) { this._fecha = fecha; }
    set hora(hora) { this._hora = hora; }
    set estatus(estatus) { this._estatus = estatus; }

    // Getters
    get id() { return this._id; }
    get idUsuario() { return this._idUsuario; }
    get idProducto() { return this._idProducto; }
    get cantidad() { return this._cantidad; }
    get fecha() { return this._fecha; }
    get hora() { return this._hora; }
    get estatus() { return this._estatus; }

    // Obtener la venta con o sin ID
    get getVenta() {
        const conId = {
            id: this.id,
            idUsuario: this.idUsuario,
            idProducto: this.idProducto,
            nombreUsuario: this._nombreUsuario,
            nombreProducto: this._nombreProducto,
            cantidad: this.cantidad,
            fecha: this.fecha,
            hora: this.hora,
            estatus: this.estatus
        };

        const sinId = {
            idUsuario: this.idUsuario,
            idProducto: this.idProducto,
            nombreUsuario: this._nombreUsuario,
            nombreProducto: this._nombreProducto,
            cantidad: this.cantidad,
            fecha: this.fecha,
            hora: this.hora,
            estatus: this.estatus
        };

        return this.id ? conId : sinId;
    }
}

module.exports = Venta;
