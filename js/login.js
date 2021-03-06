//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    
});

// funcion que valida que el usuario esta bien ingresado
function validarUsuario(valor){
    var error = document.getElementById("error-usuario");
    var user =  document.getElementById("usuario");
    if(valor == ""){    
            error.innerHTML = "Ingrese un usuario";    
            error.style.display = "block";
            user.style.background = "#FAD2CD";
            return false;
    }else if (valor.indexOf("@") == -1){
                error.innerHTML = "Ingrese un correo valido";  
                error.style.display = "block";
                user.style.background = "#FAD2CD";
                return false;
        } else {
            error.style.display = 'none';
            user.style.background = "white";
            return true;
        }
}

// funcion que valida que la pass esta bien ingresa
function validarPass(valor){
    var error = document.getElementById("error-pass");
    
    var pass = document.getElementById("password");
    if(valor == ""){
            error.innerHTML = "Ingrese una contraseña";    
            error.style.display = "block";
            pass.style.background = "#FAD2CD";
            return false;
    }else if(valor.length < 5){
            error.innerHTML = "Ingrese minimo 5 caracteres";
            error.style.display = "block";
            pass.style.background = "#FAD2CD";
            return false;
        }else{
            error.style.display = 'none';
            pass.style.background = "white";
            return true;
        }
}

// funcion del boton de ingresar que valida los datos
function validarParametros(){
    var user = document.getElementById("usuario").value;
    var pass = document.getElementById("password").value;
    var valido_user = validarUsuario(user);
    var valida_pass = validarPass(pass);

    if (valida_pass && valido_user){
        sessionStorage.setItem("usuario",user);
        window.location.assign('index.html');
    }
}