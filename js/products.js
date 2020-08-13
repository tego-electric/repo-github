var arrayproductos = [];
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            productosDetalle(arrayproductos);
        }
    });
});


function productosDetalle(array){
    var htmlAppendToInner = "";
    
    var container_div = document.getElementById("containerDecks");
    
    for (i = 0; i<array.length;i++){
        if  (i%3 == 0){
                if (i!= 0){
                    container_div.lastChild.innerHTML = htmlAppendToInner;
                    htmlAppendToInner = "";
                }
                var newrow = document.createElement("div");
                newrow.className = "row";
                container_div.appendChild(newrow);
        }
        let dato = array[i];
        htmlAppendToInner+= `
        <div class="col-sm-4" style ="padding: 10px ">
        <div class="card"">
            <div class="card-header" style="text-align: right">Sold count: `+ dato.soldCount +`</div>
            <img src="`+ dato.imgSrc + `" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">`+ dato.name +`</h5>
                <p class="card-text">`+ dato.description +`</p>
            </div>
            <div class="card-footer">
                <div style="font-size:25px; vertical-align:middle">`+ dato.currency+ `: `+dato.cost+`</div>
            </div>
        </div>
        </div>`
    }
    document.getElementById("containerDecks").lastChild.innerHTML = htmlAppendToInner;
}