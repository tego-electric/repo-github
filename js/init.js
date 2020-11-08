const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";
const CART_INFO_URL2 = "https://japdevdep.github.io/ecommerce-api/cart/654.json";


var showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function(url){
    var result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

  if (sessionStorage.length != 0){
    var user = sessionStorage.getItem("usuario");
    var pos = user.lastIndexOf("@");
    var newuser = user.slice(0,pos);
    var btns = document.getElementsByClassName("btn dropdown-toggle")
    for(let i =0; i<btns.length;i++){
      btns[i].innerHTML = newuser;
    }
  }
  
  if (localStorage.getItem("perfilUsuario") == null){
    var datos = {
      "Nombres":"",
      "Apellidos": "",
      "Edad":"",
      "Telefono": "",
      "correo" : "",
      "FotoPerfil":""
      }
    localStorage.setItem("perfilUsuario",JSON.stringify(datos));
  }else{
    var imagenes = document.getElementsByName("nav_img_perfil");
    var datos = JSON.parse(localStorage.getItem("perfilUsuario"))
    for(i = 0; i < imagenes.length; i++){
      imagenes[i].src = datos.FotoPerfil;
    }
  }
});


//google functions
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  console.log('Full Name: ' + profile.getName());
  console.log('Given Name: ' + profile.getGivenName());
  console.log('Family Name: ' + profile.getFamilyName());
  console.log("Image URL: " + profile.getImageUrl());
  console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  //var id_token = googleUser.getAuthResponse().id_token;
  //console.log("ID Token: " + id_token);
}

function signOut(){
  sessionStorage.clear();
  window.location.assign('login.html');  
}
