var arrayproductos = [];
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(LISTA_ACTORES).then(function(resultObj) {
        if (resultObj.status === "ok") {
            arrayproductos = resultObj.data;
            //Muestro las categorías ordenadas
            crearElementosBasicos();
            productos(arrayproductos);
        }
    });
});


function productos(array){

}