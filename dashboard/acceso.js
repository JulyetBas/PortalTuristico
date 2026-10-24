
/* ===== ACCESO WAYRA KAWSAY ===== */

document.addEventListener("DOMContentLoaded", function () {


    // Comprobar si hay una sesión iniciada.
    async function verificarSesion() {
        try {
            const respuesta = await fetch("../config/verificar_sesion.php", {
                method: "GET",
                credentials: "same-origin"
            });

            const usuario = await respuesta.json();

            if (usuario.exito) {
                console.log("Sesión iniciada:", usuario.usuario);
            } else {
                console.log("No hay una sesión iniciada.");
            }

            return usuario;

        } catch (error) {
            console.error("Error al verificar la sesión:", error);
            return { exito: false };
        }
    }

    verificarSesion();


    // Elementos principales
    const fondoAcceso = document.getElementById("fondo-acceso");

    const abrirAcceso = document.getElementById("abrir-acceso");
    const cerrarAcceso = document.getElementById("cerrar-acceso");

    const btnEntrar = document.getElementById("btn-entrar");
    const btnCrearCuenta = document.getElementById("btn-crear-cuenta");
    const pestanasAcceso = document.getElementById("pestanas-acceso");

    const formEntrar = document.getElementById("form-entrar");
    const formCrearCuenta = document.getElementById("form-crear-cuenta");

    const formRecuperarClave = document.getElementById("form-recuperar-clave");
const correoRecuperacion = document.getElementById("correo-recuperacion");
const volverEntrar = document.getElementById("volver-entrar");

    const tituloAcceso = document.getElementById("titulo-acceso");
    const descripcionAcceso = document.getElementById("descripcion-acceso");

    const mensajeAcceso = document.getElementById("mensaje-acceso");

    // Verificar que estamos en la página que contiene la ventana.
    if (!fondoAcceso || !cerrarAcceso || !btnEntrar ||
        !btnCrearCuenta || !formEntrar || !formCrearCuenta) {
        return;
    }

    // Cambiar entre inicio de sesión y registro.
   

function mostrarFormulario(tipo) {

    mensajeAcceso.textContent = "";

    // Ocultar todos los formularios.
    formEntrar.hidden = true;
    formCrearCuenta.hidden = true;

    if (formRecuperarClave) {
        formRecuperarClave.hidden = true;
    }

    if (pestanasAcceso) {
    pestanasAcceso.hidden = false;
}

    // Mostrar únicamente el formulario seleccionado.
    if (tipo === "entrar") {

        formEntrar.hidden = false;

        btnEntrar.classList.add("activa");
        btnCrearCuenta.classList.remove("activa");

        tituloAcceso.textContent = "¡Bienvenido de nuevo!";
        descripcionAcceso.textContent =
            "Inicia sesión para continuar o crea una cuenta para comenzar.";

    } else if (tipo === "crear") {

        formCrearCuenta.hidden = false;

        btnCrearCuenta.classList.add("activa");
        btnEntrar.classList.remove("activa");

        tituloAcceso.textContent = "¡Únete a Wayra Kawsay!";
        descripcionAcceso.textContent =
            "Crea tu cuenta y comienza a descubrir Nariño.";
    }
}



    // Botones de las pestañas.
    btnEntrar.addEventListener("click", function () {
        mostrarFormulario("entrar");
    });

    btnCrearCuenta.addEventListener("click", function () {
        mostrarFormulario("crear");
    });



     // Recuperación de contraseña.
    const olvidoClave = document.getElementById("olvido-clave");

    console.log("Botón olvidar clave:", olvidoClave);
console.log("Formulario recuperación:", formRecuperarClave);
console.log("Campo correo recuperación:", correoRecuperacion);

    if (olvidoClave && formRecuperarClave && correoRecuperacion) {
        olvidoClave.addEventListener("click", function () {

            formEntrar.hidden = true;
            formCrearCuenta.hidden = true;
            formRecuperarClave.hidden = false;

            if (pestanasAcceso) {
    pestanasAcceso.hidden = true;
}

            tituloAcceso.textContent = "Recuperar contraseña";
            descripcionAcceso.textContent =
                "Escribe el correo con el que creaste tu cuenta.";

            mensajeAcceso.textContent = "";

            const correoEntrar = document.getElementById("correo-entrar");

            if (correoEntrar) {
                correoRecuperacion.value = correoEntrar.value.trim();
            }

            correoRecuperacion.focus();
        });
    }

    // Volver al formulario de inicio de sesión.
    if (volverEntrar) {
        volverEntrar.addEventListener("click", function () {
            mostrarFormulario("entrar");
        });
    }

    
   // ===== MENÚ DEL PERFIL =====

const contenedorPerfil = abrirAcceso.closest(".nav-user");
const menuPerfil = document.getElementById("menu-perfil");
const abrirMenuPerfil = document.getElementById("abrir-menu-perfil");
const nombreMenuPerfil = document.getElementById("nombre-menu-perfil");
const avatarMenu = document.getElementById("avatar-menu");
const mensajeMenuPerfil = document.getElementById("mensaje-menu-perfil");

if (!abrirAcceso || !menuPerfil || !abrirMenuPerfil) {
    return;
}

let sesionActual = { exito: false };

// Actualizar la apariencia según el estado de la sesión.

function actualizarEstadoPerfil(usuario) {
    sesionActual = usuario;

    if (usuario.exito) {
        if (nombreMenuPerfil) {
            nombreMenuPerfil.textContent = usuario.usuario;
        }

       
if (avatarMenu) {
    const nombreVisible = (usuario.usuario || "Viajero").trim();

    avatarMenu.replaceChildren();

    if (usuario.foto_perfil) {
        const imagen = document.createElement("img");

        // La ruta de la base de datos parte de dashboard.
        // En las páginas principales quitamos el ../ inicial.
       imagen.src = "/portal/PortalTuristico/fotos_perfil/" +
    usuario.foto_perfil.split("/").pop();
        imagen.alt = "Foto de perfil";

        imagen.onerror = function () {
            avatarMenu.replaceChildren();
            avatarMenu.textContent =
                nombreVisible.charAt(0).toUpperCase();
            avatarMenu.classList.add("avatar-inicial");
        };

        avatarMenu.appendChild(imagen);
        avatarMenu.classList.remove("avatar-inicial");
    } else {
        avatarMenu.textContent = nombreVisible.charAt(0).toUpperCase();
        avatarMenu.classList.add("avatar-inicial");
    }
}


        abrirMenuPerfil.hidden = false;

    } else {
        abrirMenuPerfil.hidden = true;
        menuPerfil.hidden = true;
        abrirMenuPerfil.setAttribute("aria-expanded", "false");

        if (avatarMenu) {
            avatarMenu.textContent = "👤";
            avatarMenu.classList.remove("avatar-inicial");
        }

        if (mensajeMenuPerfil) {
            mensajeMenuPerfil.hidden = true;
            mensajeMenuPerfil.textContent = "";
        }
    }
}



// Comprobar la sesión al cargar la página.
verificarSesion().then(actualizarEstadoPerfil);

// La personita conserva su función original.
abrirAcceso.addEventListener("click", async function (evento) {
    evento.stopPropagation();

    const usuario = await verificarSesion();
    actualizarEstadoPerfil(usuario);

    if (!usuario.exito) {
        fondoAcceso.hidden = false;
        mostrarFormulario("entrar");
    }
});

// La flecha controla exclusivamente el menú del perfil.
abrirMenuPerfil.addEventListener("click", async function (evento) {
    evento.stopPropagation();

    const usuario = await verificarSesion();
    actualizarEstadoPerfil(usuario);

    if (!usuario.exito) return;

    menuPerfil.hidden = !menuPerfil.hidden;

    abrirMenuPerfil.setAttribute(
        "aria-expanded",
        String(!menuPerfil.hidden)
    );
});

// Acciones de las opciones del menú.
menuPerfil.addEventListener("click", async function (evento) {
    const opcion = evento.target.closest("[data-opcion]");

    if (!opcion) return;

    const accion = opcion.dataset.opcion;

   
if (accion === "cerrar-sesion") {
    try {
        const respuesta = await fetch("../config/cerrar_sesion.php", {
            method: "POST",
            credentials: "same-origin"
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.exito) {
            window.location.href = "index.html";
        } else {
            throw new Error("No se pudo cerrar la sesión.");
        }
    } catch (error) {
        if (mensajeMenuPerfil) {
            mensajeMenuPerfil.hidden = false;
            mensajeMenuPerfil.textContent =
                "No se pudo cerrar la sesión. Inténtalo de nuevo.";
        }
        console.error(error);
    }

    return;
}


   // Navegar a la página correspondiente del perfil.
const paginasPerfil = {
    "editar-perfil": "cuenta.html",
    "cronograma": "cuenta.html?seccion=cronograma",
    "destinos-favoritos": "cuenta.html?seccion=destinos-favoritos",
    "eventos-favoritos": "cuenta.html?seccion=eventos-favoritos"
};

if (paginasPerfil[accion]) {
    menuPerfil.hidden = true;

    abrirMenuPerfil.setAttribute("aria-expanded", "false");

    window.location.href = paginasPerfil[accion];
}
});

// Cerrar el menú al hacer clic fuera.
document.addEventListener("click", function (evento) {
    if (contenedorPerfil && !contenedorPerfil.contains(evento.target)) {
        menuPerfil.hidden = true;
        abrirMenuPerfil.setAttribute("aria-expanded", "false");
    }
});
    
    

cerrarAcceso.addEventListener("click", function () {
    fondoAcceso.hidden = true;
});



    // Cerrar al pulsar fuera de la ventana.
    fondoAcceso.addEventListener("click", function (evento) {
        if (evento.target === fondoAcceso) {
            fondoAcceso.hidden = true;
        }
    });

    
    // Mostrar u ocultar contraseñas.
    const botonesClave = document.querySelectorAll(".mostrar-clave");

    botonesClave.forEach(function (boton) {

        const idCampo = boton.dataset.campo;
        const campo = document.getElementById(idCampo);

        if (!campo) return;

        // Evitar que el navegador agregue un control de revelado en Edge.
        campo.classList.add("campo-clave-personalizado");

        
function actualizarIcono(mostrar) {
    boton.innerHTML = mostrar
        ? `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `
        : `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3l18 18"></path>
                <path d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a15.5 15.5 0 0 1-4 4.6"></path>
                <path d="M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.5 0 2.8-.4 4-1"></path>
            </svg>
        `;

    boton.setAttribute(
        "aria-label",
        mostrar ? "Ocultar contraseña" : "Mostrar contraseña"
    );
}

        // Mostrar el ojo inicial.
        actualizarIcono(false);

        boton.addEventListener("click", function () {
            const mostrar = campo.type === "password";

            campo.type = mostrar ? "text" : "password";

            actualizarIcono(mostrar);
        });
    });


    // Registrar una cuenta mediante PHP.
    formCrearCuenta.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const correo = document.getElementById("correo-registro").value.trim();
        const clave = document.getElementById("clave-registro").value;
        const confirmarClave = document.getElementById("confirmar-clave").value;

        if (clave !== confirmarClave) {
            mensajeAcceso.textContent =
                "Las contraseñas no coinciden. Inténtalo nuevamente.";
            return;
        }

        const datos = new FormData();
        datos.append("correo", correo);
        datos.append("contraseña", clave);
        datos.append("confirmar_contraseña", confirmarClave);

        mensajeAcceso.textContent = "Creando tu cuenta...";

       
try {
    const respuesta = await fetch("../config/registrar.php", {
        method: "POST",
        body: datos
    });

    const texto = await respuesta.text();

    console.log("Estado HTTP:", respuesta.status);
    console.log("Respuesta de PHP:", texto);

    const resultado = JSON.parse(texto);

    mensajeAcceso.textContent = resultado.mensaje;

    if (resultado.exito) {
        formCrearCuenta.reset();
    }

} catch (error) {
    console.error("Error al registrar:", error);

    mensajeAcceso.textContent =
        "Ocurrió un error. Revisa la consola del navegador.";

}

    });





    // Iniciar sesión mediante PHP.
    formEntrar.addEventListener("submit", async function (evento) {

        evento.preventDefault();

        const correo = document.getElementById("correo-entrar").value.trim();
        const clave = document.getElementById("clave-entrar").value;

        const datos = new FormData();
        datos.append("correo", correo);
        datos.append("contrasena", clave);

        mensajeAcceso.textContent = "Verificando tus datos...";

        try {
            const respuesta = await fetch("../config/iniciar_sesion.php", {
                method: "POST",
                body: datos,
                credentials: "same-origin"
            });

            const texto = await respuesta.text();

            console.log("Estado HTTP:", respuesta.status);
            console.log("Respuesta de PHP:", texto);

            const resultado = JSON.parse(texto);

            mensajeAcceso.textContent = resultado.mensaje;

            
if (resultado.exito) {
    console.log("Sesión iniciada correctamente.");

    formEntrar.reset();
    fondoAcceso.hidden = true;

    const usuario = await verificarSesion();
    actualizarEstadoPerfil(usuario);
}


        } catch (error) {
            console.error("Error al iniciar sesión:", error);

            mensajeAcceso.textContent =
                "Ocurrió un error. Revisa la consola del navegador.";
        }
    });


    // Recuperación de contraseña.
  
   



});
