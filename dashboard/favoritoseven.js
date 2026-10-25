
document.addEventListener("DOMContentLoaded", () => {
    const botonesFavoritos = document.querySelectorAll(".btn-favorito-evento");

    // Consultar los eventos que el usuario ya guardó
    async function cargarFavoritos() {
        try {
            const respuesta = await fetch(
                "../config/ver_eventos_favoritos.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const datos = await respuesta.json();

            if (!datos.exito) {
                return;
            }

            botonesFavoritos.forEach(boton => {
                const eventoId = boton.dataset.eventoId;

                const guardado = datos.eventos.some(
                    evento => evento.evento_id === eventoId
                );

                actualizarCorazon(boton, guardado);
            });

        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        }
    }

    // Cambiar la apariencia del corazón
    function actualizarCorazon(boton, guardado) {
        const corazon = boton.querySelector(".icono-corazon");

        if (!corazon) return;

        corazon.textContent = guardado ? "♥" : "♡";
        boton.setAttribute("aria-pressed", String(guardado));

        const nombreEvento = boton.dataset.eventoId;

        boton.setAttribute(
            "aria-label",
            guardado
                ? `Quitar ${nombreEvento} de favoritos`
                : `Guardar ${nombreEvento} en favoritos`
        );
    }

    // Guardar o quitar un evento de favoritos
    botonesFavoritos.forEach(boton => {
        boton.addEventListener("click", async () => {
            const eventoId = boton.dataset.eventoId;
            const guardado = boton.getAttribute("aria-pressed") === "true";
            const mensaje = boton
                .closest(".acciones-favorito-evento")
                ?.querySelector(".mensaje-favorito-evento");

            if (mensaje) mensaje.textContent = "";

            const datos = new FormData();
            datos.append("evento_id", eventoId);
            datos.append("accion", guardado ? "quitar" : "guardar");

            boton.disabled = true;

            try {
                const respuesta = await fetch(
                    "../config/gestionar_favorito_evento.php",
                    {
                        method: "POST",
                        body: datos,
                        credentials: "same-origin"
                    }
                );

                const resultado = await respuesta.json();

                if (!respuesta.ok || !resultado.exito) {
                    if (mensaje) {
                        mensaje.textContent =
                            resultado.mensaje ||
                            "No se pudo actualizar el favorito.";
                    }
                    return;
                }

                actualizarCorazon(boton, !guardado);

                if (mensaje) {
                    mensaje.textContent = guardado
                        ? "Evento quitado de favoritos."
                        : "¡Evento guardado en favoritos!";
                }

            } catch (error) {
                console.error("Error al actualizar favorito:", error);

                if (mensaje) {
                    mensaje.textContent =
                        "Ocurrió un error. Intenta nuevamente.";
                }
            } finally {
                boton.disabled = false;
            }
        });
    });

    cargarFavoritos();
});
