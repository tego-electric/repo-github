var text = document.getElementById("comment");
const urlParams = new URLSearchParams(window.location.search);
const page_parameter = urlParams.get('auto');

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    
    var arrayCompleto = [];
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            //arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            arrayCompleto = resultObj.data;           
        }
    });
    getJSONData(PRODUCT_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            //arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            showDetails(resultObj.data,arrayCompleto);
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            //arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            var datos = resultObj.data;
            for(let i = 0; i < datos.length; i++){
                agregarComentarios(datos[i].score,datos[i].description,datos[i].user,datos[i].dateTime);
            }
            
        }
    });
    

});


// seccion de descripcion

// funcion que muestra los detalles del producto
function showDetails(descripcion,array){    
    if ((descripcion.name).toLowerCase() == page_parameter.toLowerCase()){
        var imagen = document.getElementsByName("img_carrousel");

        // agrega las imagenes al carousel y en el titulo y agrega otros datos en el primer container
        for(let i =0; i<imagen.length; i++){
            imagen[i].src = descripcion.images[i]
        }
        document.getElementById("tituloCarta").innerHTML = descripcion.name;
        document.getElementById("textoVendidos").innerHTML = "Cantidad de vendidos: "+ descripcion.soldCount;
        document.getElementById("precioCarta").innerHTML = "Adquieralo desde "+ descripcion.currency + " "+ descripcion.cost;
        document.getElementById("descripcionCarta").innerHTML = descripcion.description;

        // se agregan los productos relacionados corresponientes
        var contenedor = document.getElementById("container-relacionados");
        var htmlToAppend = "";
        for(let k = 0; k < (descripcion.relatedProducts).length; k++){
            var pos = descripcion.relatedProducts[k];
            var url = window.location.href;
            var posicion = url.lastIndexOf("/");
            var url2 = url.slice(0,posicion+1);            
            var url3 = new URL(url2+"product-info.html"+ "?auto=" + array[pos].name);
            htmlToAppend += `
            <div class="col-md-3">
                <div class="card" style="background-color: rgb(221, 238, 221); width: 16rem;">
                    <img src="`+array[pos].imgSrc+`" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">`+array[pos].name+`</h5>
                    <a href="`+url3+`" >Ir a la descripción</a>
                    </div>
                </div>
            </div>
            `
        }
        contenedor.innerHTML += htmlToAppend;
    }else{
        document.getElementById("contenedor").innerHTML = "<h1>La descripcion de este producto no esta disponible. Disculpe las molestias.</h1>";
    }

}



// seccion de comentarios
text.addEventListener("keyup", (event) => {
    document.getElementById("contador").innerHTML = (200 - text.value.length);
    })

    // funcion que valida los campos del envio de comentarios, los agrega, con fecha y usuario
function envioComentario(){
    var textarea = document.getElementById("comment").value;
    var parrafo =  document.getElementById("ms-success");
    var estrellas = document.getElementById("estrellas").value;
    parrafo.innerHTML = "";
    document.getElementById("error-estrellas").style.display = "none";
    document.getElementById("error-textarea").style.display = "none";

    // procesamiento de la hora actual de la pc
    var date = new Date();
    var dateStr = "";
    dateStr += date.getFullYear() + "-";
    if(date.getMonth() < 10){
        dateStr += "0";
    }
    dateStr += date.getMonth() + "-";
    if(date.getDate() < 10){
        dateStr += "0";
    }
    dateStr += date.getDate() + " ";
    dateStr += date.getHours() + ":"+date.getMinutes()+":"+date.getSeconds();
    
    // validacion de campos
    if ((textarea == "")  || (estrellas == "")){
        if(textarea == ""){
            document.getElementById("error-textarea").style.display = "block";
            setTimeout(() => {
                document.getElementById("error-textarea").style.display = "none";
            }, 5000);
        }
        if(estrellas == ""){
            document.getElementById("error-estrellas").style.display = "block";
            setTimeout(() => {
                document.getElementById("error-estrellas").style.display = "none";
            }, 5000);
        }
    }else{
        var user = sessionStorage.getItem("usuario");
        var pos = user.lastIndexOf("@");
        var newuser = user.slice(0,pos);
        var score = document.getElementById("estrellas").value;
        parrafo.innerHTML = newuser  +" Su comentario a sido enviado satisfactoriamente!";        
        parrafo.style.color = "green";
        parrafo.style.display = "block";
        setTimeout(() => {
            parrafo.style.display = "none";
        }, 5000);

        agregarComentarios(score,text.value,newuser,dateStr);
        document.getElementById("formulario-comentarios-nuevos").reset();
        document.getElementById("contador").innerHTML = "200";
        pintarEstrellas(0);
    }
}

// funcion que pinta las estrellas dependiendo del valor ingresado
function pintarEstrellas(num){
    var estrellas = document.getElementsByName("star");
    for(let i =0; i<estrellas.length;i++){
        if(i<num){
            estrellas[i].className = "fa fa-star checked";
        }else{
            estrellas[i].className = "fa fa-star";
        }        
    }
    document.getElementById("estrellas").value = num;
}

// funcion del boton de agregado de comentarios
function agregarComentarios(score,description,user,dateTime){
    if (document.getElementById("contenedor").innerHTML != "<h1>La descripcion de este producto no esta disponible. Disculpe las molestias.</h1>"){
        var htmlToAppend = `
        <div class="card-body">
            <div class="row border border-dark justify-content-between" style="background-color: rgb(221, 238, 221); font-size: 18px;">
            <div class="col-md-4">
                El usuario `+user+` comento:
            </div>
            <div class="col-md-4" id="cardHora">
                Fecha: `+dateTime+`
            </div>
            </div>
            <div class="row">
            <div class="col-md-4 border border-dark " >
                <div class="row justify-content-center">
                    <div class="form-group ">
                    <p style="font-size:19px">Calificación:</p>`;
        for(let k = 0; k<5;k++){
            if (k<score){
                htmlToAppend += `<span class="fa fa-star checked" ></span>`;
            }else{
                htmlToAppend += `<span class="fa fa-star"></span>`;
            }
        }
        htmlToAppend += `            
                        </div>
                    </div>
                    
                </div>
                <div class="col-md-8 border border-dark" >
                `+description+`
                </div>
            </div>
        </div>
        `
        document.getElementById("collapseOne").innerHTML += htmlToAppend;    
    }
}