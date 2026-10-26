
const temporizadoresMensajes = new WeakMap();

document.addEventListener("click", async function (event) {
    const boton = event.target.closest(".btn-agregar-cronograma");

    if (!boton || boton.disabled) {
        return;
    }

    const bloque = boton.closest(".acciones-cronograma-evento");
    const mensaje = bloque.querySelector(".mensaje-cronograma-evento");
    const eventoId = boton.dataset.eventoId;

    // Cancelar el temporizador anterior de este mensaje.
    const temporizadorAnterior = temporizadoresMensajes.get(mensaje);

    if (temporizadorAnterior) {
        clearTimeout(temporizadorAnterior);
    }

    // Ocultar cualquier mensaje anterior al comenzar.
    mensaje.textContent = "";
    mensaje.classList.remove("visible");

    const datos = new FormData();
    datos.append("evento_id", eventoId);

    boton.disabled = true;
    mensaje.textContent = "Actualizando tu cronograma...";
    mensaje.classList.add("visible");

    try {
        const respuesta = await fetch("../config/agregar_cronograma.php", {
            method: "POST",
            credentials: "same-origin",
            body: datos
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.exito) {
            throw new Error(
                resultado.mensaje || "No se pudo actualizar el cronograma."
            );
        }

        // Actualizar el botón según la operación realizada.
        if (resultado.accion === "agregado") {
            boton.dataset.agregado = "true";
            boton.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14"/>
                </svg>
            `;
            boton.title = "Quitar de tu cronograma";
            boton.setAttribute("aria-label", "Quitar este evento de tu cronograma");
        } else if (resultado.accion === "eliminado") {
            boton.dataset.agregado = "false";
            boton.innerHTML = `
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
            `;
            boton.title = "Agregar a tu cronograma";
            boton.setAttribute("aria-label", "Agregar este evento a tu cronograma");
        }

        mensaje.textContent = resultado.mensaje;

    } catch (error) {
        mensaje.textContent =
            error.message || "Ocurrió un error al actualizar el cronograma.";

    } finally {
        boton.disabled = false;

        // Desaparecer el mensaje después de 3 segundos.
        const temporizador = setTimeout(() => {
            mensaje.textContent = "";
            mensaje.classList.remove("visible");
            temporizadoresMensajes.delete(mensaje);
        }, 3000);

        temporizadoresMensajes.set(mensaje, temporizador);
    }
});
