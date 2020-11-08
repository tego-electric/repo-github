//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.


document.addEventListener("DOMContentLoaded", function (e) {
    cargarUsuario();
    
});

// listener de los campos
document.getElementById("edadPerfil").addEventListener("keypress",function(e){
    if (!soloNumeros(e)){
        e.preventDefault();
    }  
})
document.getElementById("telefonoPerfil").addEventListener("keypress",function(e){
    if (!soloNumeros(e)){
        e.preventDefault();
    }  
})
document.getElementById("nombresPerfil").addEventListener("keypress",function(e){
    if (!soloLetras(e)){
        e.preventDefault();
    }  
})
document.getElementById("apellidosPerfil").addEventListener("keypress",function(e){
    if (!soloLetras(e)){
        e.preventDefault();
    }  
})


// funcion que carga los datos del usuario
// 

function cargarUsuario(){
    if (localStorage.getItem("perfilUsuario") != null){
        var datos = JSON.parse(localStorage.getItem("perfilUsuario"));
        var nombre = document.getElementById("nombresPerfil");
        nombre.value = datos.Nombres;
        if (datos.Nombres != ""){
            nombre.disabled = true;
        }

        var apellido =  document.getElementById("apellidosPerfil");
        apellido.value = datos.Apellidos;
        if (datos.Apellidos != ""){
            apellido.disabled = true;
        }

        var edad =  document.getElementById("edadPerfil")
        edad.value = datos.Edad;
        if (datos.Edad != ""){
            edad.disabled = true;
        }

        var email = document.getElementById("e_mailPerfil")
        email.value = datos.correo;
        if (datos.correo != ""){
            email.disabled = true;
        }

        var telefono = document.getElementById("telefonoPerfil")
        telefono.value = datos.Telefono;
        if (datos.Telefono != ""){
            telefono.disabled = true;
        }        
        
        if (datos.FotoPerfil != ""){
            document.getElementById("imagePreview").src = datos.FotoPerfil;
        }
    }
}

// 
// funciones de validacion de campos
// 

function nombrePerfil(nombres){
    if (nombres == ""){
        document.getElementById("error-nombresPerfil").style.display = "block";
        return false;
    }else{
        document.getElementById("error-nombresPerfil").style.display = "none";
        return true;
    }
}

function apellidoPerfil(apellidos){
    if (apellidos == ""){
        document.getElementById("error-apellidosPerfil").style.display = "block";
        return false;
    }else{
        document.getElementById("error-apellidosPerfil").style.display = "none";
        return true;
    }
}

function emailPerfil(email){
    if (email == ""){
        document.getElementById("error-e_mailPerfil").innerHTML = "Ingrese un correo"
        document.getElementById("error-e_mailPerfil").style.display = "block";
        return false;
    }else if (email.indexOf("@") != -1){
            document.getElementById("error-e_mailPerfil").style.display = "none";
            return true;
        }else{
            document.getElementById("error-e_mailPerfil").innerHTML = "Ingrese un correo valido"
            document.getElementById("error-e_mailPerfil").style.display = "block";
            return false;
        }
}

function edadPersona(edad){
    if (edad == ""){
        document.getElementById("error-edadPerfil").style.display = "block";
        return false;
    }else{
        document.getElementById("error-edadPerfil").style.display = "none";
        return true;
    }
}

function telefonoPersona(telefono){
    if (telefono == ""){
        document.getElementById("error-telefonoPerfil").style.display = "block";
        return false;
    }else{
        document.getElementById("error-telefonoPerfil").style.display = "none";
        return true;
    }
}

// sube la imagen a imgBB y la carga en los datos del usuario
function subirImagen(){
    var imagen = document.getElementById("formImage");
    if (imagen.files.length != 0){
        var form = new FormData();
        form.append("image", imagen.files[0])
        var url = "https://api.imgbb.com/1/upload?key=0c2fde5ed96e8dcf1f485a7d001f9a7c&expiration=1296000";

        
        fetch(url,{
            method : "POST",
            body: form
        })
            .then(res=> res.json())
            .catch(error=>console.error('Error: ',error))
            .then(res => {
                console.log('success: ',res);
                var prof = res.data.image.url;
                document.getElementById("imagePreview").src = prof;
            })
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
// funciones de guardado, modificar y retablecer
// 

// habilita los campos para poder ser modificados
function modificarPerfil(){
    document.getElementById("nombresPerfil").disabled = false;
    document.getElementById("apellidosPerfil").disabled = false;
    document.getElementById("edadPerfil").disabled = false;
    document.getElementById("e_mailPerfil").disabled = false;
    document.getElementById("telefonoPerfil").disabled = false;
}

// guarda los datos del perfil si al menos 1 campo fue modificado
function guardarDatosPerfil(){
    var nombre =document.getElementById("nombresPerfil").value;
    var apellido = document.getElementById("apellidosPerfil").value;
    var email = document.getElementById("e_mailPerfil").value;
    var edad = document.getElementById("edadPerfil").value;
    var telefono = document.getElementById("telefonoPerfil").value;
    var imagPerfil = document.getElementById("imagePreview").src;
    if (imagPerfil.indexOf("my-profile.html") != -1){
        imagPerfil = "";
    }

    var nombre_ingresado = nombrePerfil(nombre);
    var apellido_ingresado = apellidoPerfil(apellido);
    var email_ingresado = emailPerfil(email);
    var edad_ingresada = edadPersona(edad);
    var telefono_ingresado = telefonoPersona(telefono);
    var camposCorrectos = nombre_ingresado && apellido_ingresado &&  email_ingresado
                            email_ingresado && edad_ingresada && telefono_ingresado;

    if (camposCorrectos){
        var datos = JSON.parse(localStorage.getItem("perfilUsuario"));
        var datosDistintos = (datos.Nombres != nombre || datos.Apellidos != apellido || 
                            datos.Edad != edad || datos.correo != email || datos.Telefono != telefono
                            || imagPerfil != datos.FotoPerfil);
        if (datosDistintos){
            datos.Nombres = document.getElementById("nombresPerfil").value;
            datos.Apellidos = document.getElementById("apellidosPerfil").value;
            datos.Edad = document.getElementById("edadPerfil").value;
            datos.correo = document.getElementById("e_mailPerfil").value;
            datos.Telefono = document.getElementById("telefonoPerfil").value;
            if (imagPerfil != ""){
                datos.FotoPerfil = imagPerfil;
                var pos_img = document.getElementsByName("nav_img_perfil");
                for(i = 0; i < pos_img.length; i++){
                    pos_img[i].src = datos.FotoPerfil;
                }
            }
                        
            localStorage.setItem("perfilUsuario",JSON.stringify(datos));
            $('#modalGuardarDatos').modal('show');
            cargarUsuario();
        }else{  $('#modalErrorGuardarDatos').modal('show');   
            }         
    }

}

// restablece los valores predetermiandos del perfil
function restablecer(){
    if (localStorage.getItem("perfilUsuario") != null){
        var datos = JSON.parse(localStorage.getItem("perfilUsuario"));
        var nombre = document.getElementById("nombresPerfil");
        nombre.value = datos.Nombres;
        

        var apellido =  document.getElementById("apellidosPerfil");
        apellido.value = datos.Apellidos;
        

        var edad =  document.getElementById("edadPerfil")
        edad.value = datos.Edad;
        

        var email = document.getElementById("e_mailPerfil")
        email.value = datos.correo;
        

        var telefono = document.getElementById("telefonoPerfil")
        telefono.value = datos.Telefono;
                
        
        document.getElementById("imagePreview").src = datos.FotoPerfil;
        document.getElementById("formImage").value = '';
    }
}
