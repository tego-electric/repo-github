const MONEDA_PESOS = "pesos"
const MONEDA_DOLARES = "dolares"
var listaArticulos = [];
var moneda = undefined;

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
    document.getElementById("monedaPesos").addEventListener("click", function(){
        showCartProduct(MONEDA_PESOS, listaArticulos);
    });
    document.getElementById("monedaDolares").addEventListener("click", function(){
        showCartProduct(MONEDA_DOLARES, listaArticulos);
    });
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
                            <input onchange="precioTotal()" name="cantidad" type="number" value="`+ product.count + `" min ="1" max="50" step="1"></input>
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
    precioTotal();
}

// calcula los precios por cantidades y los suma al subtotal
function precioTotal(){
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