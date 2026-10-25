
document.addEventListener("click", async function (event) {
    const boton = event.target.closest(".btn-agregar-cronograma");

    if (!boton) {
        return;
    }

    const bloque = boton.closest(".acciones-cronograma-evento");
    const mensaje = bloque.querySelector(".mensaje-cronograma-evento");
    const eventoId = boton.dataset.eventoId;

    const datos = new FormData();
    datos.append("evento_id", eventoId);

    boton.disabled = true;
    mensaje.textContent = "Agregando a tu cronograma...";

    try {
        const respuesta = await fetch("../config/agregar_cronograma.php", {
            method: "POST",
            credentials: "same-origin",
            body: datos
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.exito) {
            throw new Error(
                resultado.mensaje || "No se pudo agregar el evento."
            );
        }

        mensaje.textContent = resultado.mensaje;

    } catch (error) {
        mensaje.textContent =
            error.message || "Ocurrió un error al agregar el evento.";

    } finally {
        boton.disabled = false;
    }
});
