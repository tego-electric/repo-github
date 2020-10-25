const MONEDA_PESOS = "pesos"
const MONEDA_DOLARES = "dolares"
var listaArticulos = [];
var moneda = undefined;
var mensaje = undefined;

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(CART_INFO_URL2).then(function(resultObj){
        if (resultObj.status === "ok"){
            listaArticulos = (resultObj.data).articles;
            showCartProduct(MONEDA_PESOS,listaArticulos);
        }
    });
    getJSONData(CART_BUY_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            mensaje = (resultObj.data).msg;
        }
    });
    document.getElementById("monedaPesos").addEventListener("click", function(){
        showCartProduct(MONEDA_PESOS, listaArticulos);
    });
    document.getElementById("monedaDolares").addEventListener("click", function(){
        showCartProduct(MONEDA_DOLARES, listaArticulos);
    });

    // listeners que validan que solo se ingresen valores de cierto tipo
    document.getElementById("puerta").addEventListener("keypress",function(e){
        if (!soloNumeros(e)){
            e.preventDefault();
        }  
    })
    document.getElementById("direccion").addEventListener("keypress",function(e){
        if (!soloLetrasNumeros(e)){
            e.preventDefault();
        }  
    })
    document.getElementById("esquina").addEventListener("keypress",function(e){
        if (!soloLetrasNumeros(e)){
            e.preventDefault();
        }  
    })
    
});

// se muestra el carrito de compra en pantalla
function showCartProduct(tipoMoneda, array){
    let htmlcontentToAppend = "";
    moneda = tipoMoneda;
    for(let i = 0; i< array.length;i++){
        let product = array[i];
        let precioProducto =  product.unitCost;
        let monedaProducto = product.currency;
        if(tipoMoneda === MONEDA_PESOS){
            if(product.currency == "USD"){
            precioProducto = product.unitCost*40;
            monedaProducto = "UYU";
            }
        }else{if(product.currency == "UYU"){
            precioProducto = product.unitCost/40;
            monedaProducto = "USD";
            }
        }

        htmlcontentToAppend += `
        <div class="list-group-item mt-3" id="prod`+i+`">
            <div class="row">
                <div class="card" style="width: 10rem;">
                    <img src="` + product.src + `" alt="` + product.name + `" class="card-img-top">
                </div>
                <div class="col ml-3">
                    <div class="row d-flex w-100 justify-content-between">
                        <div class="col"><h4 class="mb-1">`+ product.name +`</h4>  </div>
                        <div class="col-md-1" onclick="eliminarArticulo(prod`+i+`)"><a href="#">Eliminar</a></div>                      
                    </div>
                    <hr>
                    <div class="row justify-content-between">                  
                        <div class="col">
                            <label>Cantidad</label>
                            <input onchange="precioSubtotal()" name="cantidad" type="number" value="`+ product.count + `" min ="1" max="50" step="1"></input>
                        </div>
                        <span class="text-muted">Precio unitario: ` + monedaProducto + " "+`<span name="costounit">  `+ precioProducto + `</span></span>
                    </div>
                    
                    <div class="row justify-content-end"><span>Precio por cantidad: ` + monedaProducto + " "+`<span name="precio-cantidad">  </span> </div>                    
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("contenedor-lista").innerHTML = htmlcontentToAppend;
    precioSubtotal();
}

// calcula los precios por cantidades y los suma al subtotal
function precioSubtotal(){
    let cantidad = document.getElementsByName("cantidad");
    let costo = document.getElementsByName("costounit");
    let precioPrevio = document.getElementsByName("precio-cantidad");
    let suma = 0;
    let previa = 0;

    for (let i = 0; i<cantidad.length; i++){
        previa = parseFloat(costo[i].innerHTML)*parseFloat(cantidad[i].value);
        
        listaArticulos[i].count = cantidad[i].value;
        precioPrevio[i].innerHTML = previa;
        suma += previa;
    }
    if (moneda === MONEDA_PESOS){
        document.getElementById("subtotalprevio").innerHTML = "Subtotal en pesos: ";
        document.getElementById("subtotal").innerHTML =suma;
    }else{
        document.getElementById("subtotalprevio").innerHTML = "Subtotal en dolares: ";
         document.getElementById("subtotal").innerHTML = suma;
    }
       
}

// funcion que verifica que haya articulos incluidos y de transicion entre pestaña listaDecompras y metodoDeEnvio
function listaProdAMetodoEnvio(){
    var precio = document.getElementById("subtotal").innerHTML;
    if (parseFloat(precio) != 0){
        document.getElementById("error-subtotal").style.display = "none";
        var link1 = document.getElementById("lista-tab");
        var link2 = document.getElementById("envio-tab");
        var panel1 = document.getElementById("listacompras");
        var panel2 = document.getElementById("metodoenvio");

        link1.setAttribute("class", "nav-link disabled");
        link2.setAttribute("class", "nav-link active");
        panel1.setAttribute("class", "tab-pane fade");
        panel2.setAttribute("class", "tab-pane fade show active");

        var porcentaje = document.getElementsByName("radiobuttonenvio");
        var val = undefined;
        for (let i = 0; i< porcentaje.length ; i++){
            if (porcentaje[i].checked){
                val = porcentaje[i].value;
            }
        }
        precioTotal(val);
    }else{document.getElementById("error-subtotal").style.display = "block";}
}

// funcion del boton de volver atras en metodo de envio
function volverALista(){
    var link2 = document.getElementById("lista-tab");
    var link1 = document.getElementById("envio-tab");
    var panel2 = document.getElementById("listacompras");
    var panel1 = document.getElementById("metodoenvio");

    link1.setAttribute("class", "nav-link disabled");
    link2.setAttribute("class", "nav-link active");
    panel1.setAttribute("class", "tab-pane fade");
    panel2.setAttribute("class", "tab-pane fade show active");
}

// elimnar elemento de la lista
function eliminarArticulo(idproducto){
    var idElement = idproducto.getAttribute("id");
    var pos = idElement.slice(idElement.length-1, idElement.length);
    var nuevoArray = [];
    var cont = listaArticulos.length;
    for(let i = 0; i<cont;i++){
        let x = listaArticulos.shift();
        if (i != pos){         
            nuevoArray.push(x);
        }
    }
    listaArticulos = nuevoArray;
    idproducto.remove();
    showCartProduct(moneda, listaArticulos);
}

function precioTotal(porcentaje){
    var valor = parseInt(document.getElementById("subtotal").innerHTML);
    var valortotal = 0;
    if (porcentaje != undefined){
        valortotal = (parseInt(porcentaje)*valor)/100;
        valortotal += valor;
        var tipoCambio = undefined;
        if (moneda == MONEDA_DOLARES){
            tipoCambio = "USD";
        }else{tipoCambio = "$";}
        document.getElementById("subtotalModal").innerHTML = " " + tipoCambio +  valor;
        document.getElementById("envioModal").innerHTML = " " + tipoCambio + (valortotal - valor);
        document.getElementById("totalModal").innerHTML = " " + tipoCambio +  valortotal;
    }
    document.getElementById("total").innerHTML = valortotal;
}

//
// funcion que muestra el conteiner del metodo de pago
//

function mostarContainer(valor){
    var htmlToAppend = "";
    if (valor == "credito"){
        htmlToAppend = `
        <div class="col-md-12">
            <div class="row pb-2">
                <div class="col"><b><span style="text-decoration: underline">Tarjeta de credito</span></b></div>
            </div>
            <div class="row">
                <div class="col-md-5"><label for="digitosTarjeta">Digitos de la tarjeta: </label></div>
                <div class="col"><input type="text" id="digitosTarjeta" maxlength="20" onblur="validarTarjeta(this.value)"></div>
                <label class ="container label-error" id="error-digitosCard">Digitos incorrectos</label>
            </div>
            <div class="row">
                <div class="col-md-5"><label for="fechaExpiracion">Fecha de expiracion: </label></div>
                <div class="col"><input type="date" id="fechaExpiracion" onblur="validarFecha(this.value)"></div>
                <label class ="container label-error" id="error-fechaExpiracion">Fecha mal ingresada</label>
            </div>
            <div class="row">
                <div class="col-md-5"><label for="numVerificacion">Digitos de verificacion: </label></div>
                <div class="col"><input type="text" id="numVerificacion" maxlength="3" onblur="validarDigitos(this.value)"></div>
                <label class ="container label-error" id="error-numVerificacion">Digitos incorrectos</label>
            </div>
        </div>
        `;        
    }    else{
        var dir = document.getElementById("direccion").value;
        var monto = document.getElementById("total").innerHTML;
        htmlToAppend = `
        <div class="col-md-12">
            <div class="row pb-2">
                <div class="col"><b><span style="text-decoration: underline">Transferencia bancaria</span></b></div>
            </div>
            <div class="row">
                <div class="col-md-1"><label for="paisPAgoBancario">Pais:</label></div>
                <div class="col-md-4"><input type="text" id="paisPagoBancario" onblur="validarPaisTransferencia(this.value)"></div>
                <label class ="container label-error" id="error-paisPagoBancario">Pais no valido</label>
            </div>
            <div class="row">
                <div class="col-md-8"><label for="direccionMetodo">Direccion:`+ `  ` + dir+`</label></div>
            </div>
            <div class="row">
                <div class="col-md-4"><label for="numCuetna">Num. de cuenta: </label></div>
                <div class="col-md-3"><input type="text" id="numCuenta" maxlength="10" onblur="validarCuenta(this.value)"></div>
                <label class ="container label-error" id="error-numCuenta">Digitos incorrectos</label>
            </div>
            <div class="row">
                <div class="col-md-8"><label for="">Codigo SWIFT/BIC: AAAA-BB-CC-123</label></div>
            </div>
            <div class="row">
                <div class="col-md-8"><label for="">Divisa: `+moneda+` </label></div>
            </div>
            <div class="row">
                <div class="col-md-8"><label for="">Monto: `+monto+` </label></div>
            </div>
        </div>
        `;        
    }
    var container = document.getElementById("containerMetodoPAgo");
    container.innerHTML = htmlToAppend;

    // listener para validar el ingreso de valores del tipo correspondiente
    if (valor == "credito"){
        document.getElementById("digitosTarjeta").addEventListener("keypress",function(e){
            if (!soloNumeros(e)){
                e.preventDefault();
            }  
        })
        document.getElementById("numVerificacion").addEventListener("keypress",function(e){
            if (!soloNumeros(e)){
                e.preventDefault();
            }  
        })
    }else{
        document.getElementById("numCuenta").addEventListener("keypress",function(e){
            if (!soloNumeros(e)){
                e.preventDefault();
            }  
        }) 
        document.getElementById("paisPagoBancario").addEventListener("keypress",function(e){
            if (!soloLetras(e)){
                e.preventDefault();
            }  
        })
    }
}


// 
// sector de validaciones metodo de envio
// 


// validacion direccion
function validarDireccion(){
    var dir = document.getElementById("direccion").value;
    if (dir == ""){
        document.getElementById("error-direccion").style.display = "block";
        return false;       
    }else{
        document.getElementById("error-direccion").style.display = "none";
        return true;
    }
}

// validacion puerta
function validarPuerta(){
    var puerta = document.getElementById("puerta").value;
    if (puerta == ""){
        document.getElementById("error-puerta").style.display = "block";
        return false;
    }else{
        document.getElementById("error-puerta").style.display = "none";
        return true;
    }
}

// validacion esquina
function validarEsquina(){
    var esquina = document.getElementById("esquina").value;
    if (esquina == ""){
        document.getElementById("error-esquina").style.display = "block";
        return false;
    }else{
        document.getElementById("error-esquina").style.display = "none";
        return true;
    }
}

// validacion paises
function ValidarPais(val){
    if (val == "nada"){
        document.getElementById("error-pais").style.display = "block";
        return false;
    }else{
        document.getElementById("error-pais").style.display = "none";
        return true;
    }
}

// validacion radios
function validarRadioEnvio(){
    var arrayRadios = document.getElementsByName("radiobuttonenvio");
    var noestanMarcados = false;
    for (let i = 0; i< arrayRadios.length ; i++){
        if (arrayRadios[i].checked){
            noestanMarcados = true;
        }
    }
    if (noestanMarcados){
        document.getElementById("error-selector").style.display = "none";
        return true;
    }else{
        document.getElementById("error-selector").style.display = "block";
        return false;
    }
}


function validarMetodoDeEnvio(){

    var dir = validarDireccion();
    var esquina = validarEsquina();
    var puerta = validarPuerta();
    var radio = validarRadioEnvio();
    var pais = ValidarPais(document.getElementById("pais").value);
    var todook = dir && esquina && puerta && radio && pais; 

    if (todook){
        $('#modalPago').modal('show')
    }
}


// 
// validacion de metodo de pago
// 


// valida que haya seleccionado algun metodo de pago
function validarRadioPago(){
    var arrayRadios = document.getElementsByName("radiobuttonpago");
    var noestanMarcados = false;
    for (let i = 0; i< arrayRadios.length ; i++){
        if (arrayRadios[i].checked){
            noestanMarcados = true;
        }
    }
    if (noestanMarcados){
        document.getElementById("error-metodopago").style.display = "none";
        return true;
    }else{
        document.getElementById("error-metodopago").style.display = "block";
        return false;
    }
}

// validar campos de transferencia bancaria
function validarCuenta(cuenta){
    if (cuenta.length != 10){
        document.getElementById("error-numCuenta").style.display = "block";
        return false;
    }else{
        document.getElementById("error-numCuenta").style.display = "none";
        return true;
    }
}


function validarPaisTransferencia(pais){
    if (pais.length == 0){
        document.getElementById("error-paisPagoBancario").style.display = "block";
        return false;
    }else{
        document.getElementById("error-paisPagoBancario").style.display = "none";
        return true;
    }
}



// validar campos de credito
function validarDigitos(digitos){
    if (digitos.length != 3){
        document.getElementById("error-numVerificacion").style.display = "block";
        return false;
    }else {
        document.getElementById("error-numVerificacion").style.display = "none";
        return true;
    }
}

function validarFecha(fecha){
    if (fecha == ""){
        document.getElementById("error-fechaExpiracion").style.display = "block";
        return false;
    }else {
        document.getElementById("error-fechaExpiracion").style.display = "none";
        return true;
    }
}

function validarTarjeta(tarjeta){
    if (tarjeta.length != 20){
        document.getElementById("error-digitosCard").style.display = "block";
        return false;
    }else{
        document.getElementById("error-digitosCard").style.display = "none";
        return true;
    }
}

// validar que todos los campos esten completos y bien rellendos

function validarCompra(){
    var validoRadio = validarRadioPago();
    var arrayRadios = document.getElementsByName("radiobuttonpago");
    var tipoPago = "";
    for (let i = 0; i< arrayRadios.length ; i++){
        if (arrayRadios[i].checked){
            tipoPago = arrayRadios[i].value;
        }
    }
    if (tipoPago == "credito"){
        var digitos = validarTarjeta(document.getElementById("digitosTarjeta").value);
        var fecha = validarFecha(document.getElementById("fechaExpiracion").value);
        var numero = validarDigitos(document.getElementById("numVerificacion").value);
        if (validoRadio && digitos && fecha && numero){
            $('#modalPago').modal('hide');            
            $('#modalMensaje').modal('show');
            document.getElementById("mensajeSatisfactorio").innerHTML = mensaje;
        }
    }else{
        var pais = validarPaisTransferencia(document.getElementById("paisPagoBancario").value);
        var cuenta = validarCuenta(document.getElementById("numCuenta").value);
        if (validoRadio && pais && cuenta){
            $('#modalPago').modal('hide');
            $('#modalMensaje').modal('show');
            document.getElementById("mensajeSatisfactorio").innerHTML = mensaje;
        }
    }
}


// 
// validar que son solo numeros
// 
function soloNumeros(val){
    var key = val.keyCode;
    return key >= 48 && key <= 57;
}

// 
// valdiar que solo sean letras
// 
function soloLetras(val){
    var key = val.keyCode;
    return (key >= 65 && key <= 90) || (key >= 97 && key <= 122);
}

// 
// Validar que solo sean numeros o letras
// 
function soloLetrasNumeros(val){
    var key = val.keyCode;
    return (key >= 65 && key <= 90) || (key >= 97 && key <= 122) || (key >= 48 && key <= 57);
}