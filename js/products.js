const ORDER_ASC_BY_PRICE = "priceAsd";
const ORDER_DESC_BY_PRICE = "priceDesc";
const ORDER_BY_PROD_COUNT_DESC = "cantDesc";
const ORDER_BY_PROD_COUNT_ASC = "cantAsc";
var arrayproductos = [];
var currentSortCriteria = undefined;
minCount = undefined;
maxCount = undefined;

var searchVar = document.getElementById("search");

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            sortAndShowCategories(ORDER_ASC_BY_PRICE,arrayproductos);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCountDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT_DESC);
    });

    document.getElementById("sortByCountAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_BY_PROD_COUNT_ASC);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        productosDetalle(currentCategoriesArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        productosDetalle(currentCategoriesArray);
    });
});



function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    productosDetalle(currentCategoriesArray);
}


function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_DESC){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_ASC){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }
    return result;
}

function productosDetalle(array){
    var htmlAppendToInner = "";
    
    var container_div = document.getElementById("containerDecks");
    
    for (i = 0; i<array.length;i++){
        /*if  (i%3 == 0){
                if (i!= 0){
                    container_div.lastChild.innerHTML = htmlAppendToInner;
                    htmlAppendToInner = "";
                }
                var newrow = document.createElement("div");
                newrow.className = "row";
                container_div.appendChild(newrow);
        }*/
        let dato = array[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(dato.soldCount) >= minCount)) &&
        ((maxCount == undefined) || (maxCount != undefined && parseInt(dato.soldCount) <= maxCount))){
            htmlAppendToInner+= `
            <div class="col-md-4 carta" style ="padding: 10px;">
                <div class="card h-100">
                    <div class="card-header" style="text-align: right">Sold count: `+ dato.soldCount +`</div>
                    <img src="`+ dato.imgSrc + `" class="card-img-top" alt="`+ dato.name +`">
                    <div class="card-body">
                        <h5 class="card-title">`+ dato.name +`</h5>
                        <p class="card-text">`+ dato.description +`</p>
                    </div>
                    <div class="card-footer">
                        <div style="font-size:25px; vertical-align:middle">`+ dato.currency+ `: `+dato.cost+`</div>
                    </div>
                </div>
            </div>
            `
        }
        container_div.innerHTML= htmlAppendToInner;
    }
    //container_div.lastChild.innerHTML = htmlAppendToInner;
    
}

searchVar.addEventListener("keyup", (event) => {
    getJSONData(PRODUCTS_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
        }

    });

    var container_div = document.getElementById("containerDecks");
    var valor  = (document.getElementById("search").value).toLowerCase();
    var htmlAppendToInner = "";
    for (datos of arrayproductos) {
        var nombre = (datos.name).toLowerCase();
        var desc = (datos.description).toLowerCase();
        if ((nombre.indexOf(valor) != -1) || (desc.indexOf(valor) != -1)){
            htmlAppendToInner+= `
            <div class="col-md-4 carta" style ="padding: 10px;">
                <div class="card h-100">
                    <div class="card-header" style="text-align: right">Sold count: `+ datos.soldCount +`</div>
                    <img src="`+ datos.imgSrc + `" class="card-img-top" alt="`+ datos.name +`">
                    <div class="card-body">
                        <h5 class="card-title">`+ datos.name +`</h5>
                        <p class="card-text">`+ datos.description +`</p>
                    </div>
                    <div class="card-footer">
                        <div style="font-size:25px; vertical-align:middle">`+ datos.currency+ `: `+datos.cost+`</div>
                    </div>
                </div>
            </div>
            `
        }
        container_div.innerHTML= htmlAppendToInner;
    }

});