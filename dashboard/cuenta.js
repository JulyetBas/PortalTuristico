
document.addEventListener("DOMContentLoaded", function () {

    const avatar = document.getElementById("cuenta-avatar");
    const nombrePerfil = document.getElementById("cuenta-nombre");
    const fechaPerfil = document.getElementById("cuenta-fecha");


const selectorFoto = document.getElementById("perfil-foto");
const botonQuitarFoto = document.getElementById("quitar-foto");


    const campoNombre = document.getElementById("perfil-nombre");
    const campoApellido = document.getElementById("perfil-apellido");
    const campoCorreo = document.getElementById("perfil-correo");

    const formulario = document.getElementById("formulario-perfil");
    const mensaje = document.getElementById("mensaje-perfil");
    const botonGuardar = formulario.querySelector('[type="submit"]');

    let usuarioActual = null;

    // Obtener el nombre que debe mostrarse en el perfil.
    function obtenerNombreVisible(usuario) {
        const nombre = (usuario.nombre || "").trim();
        const apellido = (usuario.apellido || "").trim();

        const personalizado = `${nombre} ${apellido}`.trim();

        return personalizado || usuario.nombre_predeterminado || "Viajero";
    }

    // Mostrar la inicial o la foto, si ya existe.
    
function mostrarAvatar(usuario) {
    const nombreVisible = obtenerNombreVisible(usuario);

    avatar.replaceChildren();

    if (usuario.foto_perfil) {
        const imagen = document.createElement("img");

        imagen.src = usuario.foto_perfil;
        imagen.alt = "Foto de perfil";

        imagen.onerror = function () {
            avatar.replaceChildren();
            avatar.textContent =
                obtenerNombreVisible(usuario).charAt(0).toUpperCase();
        };

        avatar.appendChild(imagen);
    } else {
        avatar.textContent = nombreVisible.charAt(0).toUpperCase();
    }

    botonQuitarFoto.hidden = !usuario.foto_perfil;
}


    // Mostrar los datos de la cuenta.
    function mostrarDatos(usuario) {
        usuarioActual = usuario;

        nombrePerfil.textContent = obtenerNombreVisible(usuario);

        mostrarAvatar(usuario);

        campoNombre.value = usuario.nombre || "";
        campoApellido.value = usuario.apellido || "";
        campoCorreo.value = usuario.correo || "";

        if (usuario.fecha_registro) {
            const fecha = new Date(
                usuario.fecha_registro.replace(" ", "T")
            );

            fechaPerfil.textContent = !Number.isNaN(fecha.getTime())
                ? "En Wayra Kawsay desde " +
                fecha.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
                : "Fecha de registro no disponible";
        } else {
            fechaPerfil.textContent = "Fecha de registro no disponible";
        }
    }

    
    // Seleccionar y guardar una nueva foto de perfil.
    selectorFoto.addEventListener("change", async function () {
        const archivo = selectorFoto.files[0];

        if (!archivo) {
            return;
        }

        // Comprobar el tamaño antes de enviarlo.
        if (archivo.size > 2 * 1024 * 1024) {
            mensaje.textContent = "La imagen no puede superar los 2 MB.";
            mensaje.style.color = "#B42318";
            selectorFoto.value = "";
            return;
        }

        // Comprobar los formatos admitidos.
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            mensaje.textContent = "Selecciona una imagen JPG, PNG o WEBP.";
            mensaje.style.color = "#B42318";
            selectorFoto.value = "";
            return;
        }

        const datos = new FormData();
        datos.append("foto_perfil", archivo);

        selectorFoto.disabled = true;
        mensaje.textContent = "Guardando foto...";
        mensaje.style.color = "#647568";

        try {
            const respuesta = await fetch(
                "../config/actualizar_foto.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    body: datos
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudo guardar la foto."
                );
            }

            // Volver a consultar los datos del usuario.
            await cargarPerfil();

            mensaje.textContent = resultado.mensaje;
            mensaje.style.color = "#315B43";

        } catch (error) {
            console.error("Error al guardar la foto:", error);

            mensaje.textContent =
                error.message || "Ocurrió un error al subir la foto.";

            mensaje.style.color = "#B42318";

        } finally {
            selectorFoto.disabled = false;
            selectorFoto.value = "";
        }
    });

    // Quitar la foto y volver a mostrar la inicial.
    botonQuitarFoto.addEventListener("click", async function () {
        mensaje.textContent =
            "Todavía falta conectar la eliminación de la foto.";
        mensaje.style.color = "#647568";
    });


    // Consultar los datos reales de la sesión.
    async function cargarPerfil() {
        try {
            const respuesta = await fetch(
                "../config/verificar_sesion.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const usuario = await respuesta.json();

            if (!respuesta.ok || !usuario.exito) {
                mensaje.textContent =
                    "Debes iniciar sesión para consultar tu perfil.";

                formulario.hidden = true;
                return;
            }

            formulario.hidden = false;
            mostrarDatos(usuario);

        } catch (error) {
            console.error("Error al cargar el perfil:", error);

            mensaje.textContent =
                "No se pudieron cargar los datos. Recarga la página.";
        }
    }


    // Guardar el nombre y el apellido.
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensaje.textContent = "";
        botonGuardar.disabled = true;
        botonGuardar.textContent = "Guardando...";

        try {
            const datos = new FormData();

            datos.append("nombre", campoNombre.value.trim());
            datos.append("apellido", campoApellido.value.trim());

            const respuesta = await fetch(
                "../config/actualizar_perfil.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    body: datos
                }
            );

            const textoRespuesta = await respuesta.text();

console.log("Estado HTTP:", respuesta.status);
console.log("Respuesta de actualizar_perfil.php:", textoRespuesta);

let resultado;

try {
    resultado = JSON.parse(textoRespuesta);
} catch (error) {
    throw new Error(
        "PHP no devolvió JSON válido. Revisa la respuesta en la consola."
    );
}

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudieron guardar los cambios."
                );
            }

            // Consultar nuevamente para mostrar los datos guardados.
            await cargarPerfil();

            mensaje.textContent = resultado.mensaje;
            mensaje.style.color = "#315B43";

        } catch (error) {
            console.error("Error al guardar el perfil:", error);

            mensaje.textContent =
                error.message || "Ocurrió un error al guardar los cambios.";

            mensaje.style.color = "#B42318";

        } finally {
            botonGuardar.disabled = false;
            botonGuardar.textContent = "Guardar cambios";
        }
    });

    // Cambiar la sección seleccionada del menú lateral.
    const enlaces = document.querySelectorAll(".cuenta-enlace");

    enlaces.forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            enlaces.forEach(function (otro) {
                otro.classList.remove("activo");
            });

            enlace.classList.add("activo");

            const seccion = enlace.dataset.seccion;

            if (seccion !== "editar-perfil") {
                mensaje.style.color = "#647568";
                mensaje.textContent =
                    "Esta sección la conectaremos en el siguiente paso.";
            } else {
                mensaje.textContent = "";
            }
        });
    });

    cargarPerfil();

});
