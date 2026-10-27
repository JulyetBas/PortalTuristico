const temporizadoresMensajesFavorito = new WeakMap();

function mostrarMensajeFavorito(mensaje, texto) {
    const temporizadorAnterior = temporizadoresMensajesFavorito.get(mensaje);

    if (temporizadorAnterior) {
        clearTimeout(temporizadorAnterior);
    }

    mensaje.textContent = texto;

    const temporizador = setTimeout(function () {
        mensaje.textContent = "";
        temporizadoresMensajesFavorito.delete(mensaje);
    }, 3000);

    temporizadoresMensajesFavorito.set(mensaje, temporizador);
}






document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".btn-favorito-destino");

    botones.forEach(function (boton) {
        boton.addEventListener("click", async function () {
            const destinoId = boton.dataset.destinoId;
            const icono = boton.querySelector(".icono-corazon");
            const mensaje = boton.closest(".detalle-destino")
    .querySelector(".mensaje-favorito");




            try {

const sesionRespuesta = await fetch("../config/verificar_sesion.php", {
    credentials: "same-origin"
});


               

                const usuario = await sesionRespuesta.json();

                if (!usuario.exito) {
                    mostrarMensajeFavorito(mensaje, "Inicia sesión para guardar tus destinos favoritos.");
                    return;
                }

                const estaGuardado = boton.classList.contains("activo");
                const datos = new URLSearchParams();

                datos.append("destino_id", destinoId);
                datos.append("accion", estaGuardado ? "quitar" : "guardar");

                const respuesta = await fetch("../config/gestionar_favorito_destino.php", {
               
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: datos.toString()
                });

                const resultado = await respuesta.json();

                if (!respuesta.ok || !resultado.exito) {
                 mostrarMensajeFavorito(mensaje, resultado.mensaje || "No se pudo actualizar el favorito.");
                    return;
                }

                boton.classList.toggle("activo", !estaGuardado);
                boton.setAttribute("aria-pressed", String(!estaGuardado));
                icono.textContent = estaGuardado ? "♡" : "♥";
                boton.setAttribute(
                    "aria-label",
                    estaGuardado ? "Guardar en favoritos" : "Quitar de favoritos"
                );

              mostrarMensajeFavorito(mensaje, resultado.mensaje);
            } catch (error) {
              mostrarMensajeFavorito(mensaje, "No se pudo conectar. Inténtalo de nuevo.");
                console.error("Error al gestionar favorito:", error);
            }
        });
    });
});
