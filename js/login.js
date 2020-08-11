//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    
});
function validarUsuario(valor){
    if(valor == ""){
        document.getElementById("error-usuario").style.display = "block";
    }else{
        document.getElementById("error-usuario").style.display = 'none';
    }
}

function validarPass(valor){
    if(valor == ""){
        document.getElementById("error-pass").style.display = "block";
    }else{
        document.getElementById("error-pass").style.display = 'none';
    }
}

function validarParametros(){
    var user = document.getElementById("usuario").value;
    var pass = document.getElementById("password").value;

    if ((user != "") && (pass != "")){
            sessionStorage.setItem("logeado","si");
            window.location.assign('index.html');
    }else{  if (user == ""){
                document.getElementById("error-usuario").style.display = "block";
            }
            if (pass == ""){
            document.getElementById("error-pass").style.display = "block";
            }
    }
}