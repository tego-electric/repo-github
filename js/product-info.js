var locacion = "";
var text = document.getElementById("comment");
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    locacion =  window.location.href;
    var pos = locacion.lastIndexOf("#");
    locacion = locacion.slice(pos + 1,locacion.length);
    while (locacion.indexOf("%20") != -1){
        locacion = locacion.replace("%20"," ");
    }

    getJSONData(PRODUCT_INFO_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            //arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            showDetails(resultObj.data)
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
function showDetails(descripcion){
    var contenedor = document.getElementById("contenedor");
    
    if ((descripcion.name).toLowerCase() == locacion.toLowerCase()){
        var imagen = document.getElementsByTagName("img");
        for(let i =0; i<imagen.length; i++){
            imagen[i].src = descripcion.images[i]
        }
        document.getElementById("tituloCarta").innerHTML = descripcion.name;
        document.getElementById("textoVendidos").innerHTML = "Cantidad de vendidos: "+ descripcion.soldCount;
        document.getElementById("precioCarta").innerHTML = "Adquieralo desde "+ descripcion.currency + " "+ descripcion.cost;
        document.getElementById("descripcionCarta").innerHTML = descripcion.description;
    }else{
        contenedor.innerHTML = "<h1>La descripcion de este producto no esta disponible. Disculpe las molestias.</h1>";
    }

}



// seccion de comentarios
text.addEventListener("keyup", (event) => {
    document.getElementById("contador").innerHTML = (200 - text.value.length);
    })

function envioComentario(){
    var textarea = document.getElementById("comment").value;
    var parrafo =  document.getElementById("ms-success");
    var estrellas = document.getElementById("estrellas").value;
    parrafo.innerHTML = "";
    document.getElementById("error-estrellas").style.display = "none";
    document.getElementById("error-textarea").style.display = "none";

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
    }
}


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

function agregarComentarios(score,description,user,dateTime){
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