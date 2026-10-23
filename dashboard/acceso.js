
/* ===== ACCESO WAYRA KAWSAY ===== */

document.addEventListener("DOMContentLoaded", function () {

    // Elementos principales
    const fondoAcceso = document.getElementById("fondo-acceso");

    const abrirAcceso = document.getElementById("abrir-acceso");
    const cerrarAcceso = document.getElementById("cerrar-acceso");

    const btnEntrar = document.getElementById("btn-entrar");
    const btnCrearCuenta = document.getElementById("btn-crear-cuenta");

    const formEntrar = document.getElementById("form-entrar");
    const formCrearCuenta = document.getElementById("form-crear-cuenta");

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

        if (tipo === "entrar") {

            formEntrar.hidden = false;
            formCrearCuenta.hidden = true;

            btnEntrar.classList.add("activa");
            btnCrearCuenta.classList.remove("activa");

            tituloAcceso.textContent = "¡Bienvenido de nuevo!";
            descripcionAcceso.textContent =
                "Inicia sesión para continuar o crea una cuenta para comenzar.";

        } else {

            formEntrar.hidden = true;
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

    // abrir acceso
        if (abrirAcceso) {
        abrirAcceso.addEventListener("click", function () {
            fondoAcceso.hidden = false;
            mostrarFormulario("entrar");
        });
    }

    // Cerrar la ventana.
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
        datos.append("contrasena", clave);
        datos.append("confirmar_contrasena", confirmarClave);

        mensajeAcceso.textContent = "Creando tu cuenta...";

        try {
            const respuesta = await fetch("../config/registrar.php", {
                method: "POST",
                body: datos
            });

            const resultado = await respuesta.json();

            mensajeAcceso.textContent = resultado.mensaje;

            if (resultado.exito) {
                formCrearCuenta.reset();
            }

        } catch (error) {
            console.error("Error al registrar:", error);

            mensajeAcceso.textContent =
                "No se pudo completar el registro. Revisa la conexión e inténtalo de nuevo.";
        }
    });




    // Evitar que el formulario de entrada recargue la página.
    formEntrar.addEventListener("submit", function (evento) {

        evento.preventDefault();

        mensajeAcceso.textContent =
            "La interfaz está lista. Falta conectar el sistema de inicio de sesión.";
    });

    // Recuperación de contraseña.
    const olvidoClave = document.getElementById("olvido-clave");

    if (olvidoClave) {
        olvidoClave.addEventListener("click", function () {

            mensajeAcceso.textContent =
                "La recuperación de contraseña estará disponible al conectar la autenticación.";
        });
    }

});
