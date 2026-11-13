
// =====================================
// INFORMACIÓN DE LOS PLANES
// =====================================
// Ruta de los archivos PHP
const rutaResenas = "../config/";
const planes = [

    {
        id: 1,
        titulo: "Nariño Natural",
        descripcion: "Una experiencia para disfrutar de los paisajes naturales de Nariño, recorrer lugares sorprendentes y conectar con la tranquilidad de sus entornos.",
        duracion: "6 días · 5 noches",
        imagen: "imagenes/pajarop.webp",

        publicado: "hace 2 días"
    },

    {
        id: 2,
        titulo: "Nariño de Fe y Tradición",
        descripcion: "Descubre la riqueza religiosa y cultural de Nariño a través de sus templos y santuarios más representativos, y disfruta de una experiencia de descanso en las aguas termales de Ambiaku.",
        duracion: "5 días · 4 noches",
        imagen: "imagenes/sandonaigle.jpeg",

        publicado: "hace 5 días"
    }

];


// =====================================
// MOSTRAR LAS TARJETAS
// =====================================

const listadoPlanes = document.getElementById("listado-planes");
// =====================================
// CALIFICACIÓN REAL DE CADA PLAN
// =====================================

async function obtenerCalificacionPlan(idPlan) {

    try {

        const respuesta = await fetch(
            `${rutaResenas}reseñas_planes.php?accion=consultar&id_plan=${idPlan}`
        );

        const resultado = await respuesta.json();

        if (!resultado.exito) {
            return { cantidad: 0, promedio: 0 };
        }

        const resenas = resultado.datos.reseñas;

        if (resenas.length === 0) {
            return { cantidad: 0, promedio: 0 };
        }

        const suma = resenas.reduce(
            (total, resena) => total + Number(resena.general),
            0
        );

        return {
            cantidad: resenas.length,
            promedio: suma / resenas.length
        };

    } catch (error) {

        console.error("Error al obtener calificación:", error);

        return { cantidad: 0, promedio: 0 };

    }

}

async function mostrarPlanes() {

    listadoPlanes.innerHTML = "";

    for (const plan of planes) {

        const calificacion = await obtenerCalificacionPlan(plan.id);

        const tarjeta = document.createElement("a");
        tarjeta.classList.add("tarjeta-plan");
        tarjeta.href = `#detalle-plan-${plan.id}`;

        tarjeta.addEventListener("click", (event) => {
            event.preventDefault();
            mostrarDetalle(plan.id);
        });

        const estrellasLlenas = Math.round(calificacion.promedio);
        const estrellasVacias = 5 - estrellasLlenas;

        tarjeta.innerHTML = `

            <div class="imagen-plan">
                <img src="${plan.imagen}" alt="${plan.titulo}">
            </div>

            <div class="info-plan">

                <h2>${plan.titulo}</h2>

                <p class="descripcion-plan">
                    ${plan.descripcion}
                </p>

                <div class="duracion-plan">
                    <span>◷</span>
                    ${plan.duracion}
                </div>

                <div class="calificacion-plan">

                    <span class="estrellas-plan">
                        ${"★".repeat(estrellasLlenas)}${"☆".repeat(estrellasVacias)}
                    </span>

                    <span class="cantidad-reseñas">
                        ${calificacion.cantidad > 0
                            ? `${calificacion.promedio.toFixed(1)}/5 (${calificacion.cantidad} reseñas)`
                            : "0 reseñas"}
                    </span>

                </div>

                <div class="publicacion-plan">
                    <span>◷</span>
                    Publicado ${plan.publicado}
                </div>

            </div>

        `;

        listadoPlanes.appendChild(tarjeta);

    }

}

// =====================================
// INICIAR
// =====================================

mostrarPlanes();

// =========================================
// MOSTRAR PLANES RELACIONADOS
// =========================================

function mostrarPlanesRelacionados(idPlanActual) {

    const contenedor = document.getElementById(
        `planes-relacionados-${idPlanActual}`
    );

    if (!contenedor) return;

    // Obtener los planes diferentes al que estamos viendo
    const planesRelacionados = planes.filter(
        plan => plan.id !== idPlanActual
    );

    contenedor.innerHTML = "";

    planesRelacionados.forEach(plan => {

        const tarjeta = document.createElement("a");

        tarjeta.classList.add("tarjeta-plan", "tarjeta-relacionada");

        tarjeta.href = `#detalle-plan-${plan.id}`;

        tarjeta.innerHTML = `

            <div class="imagen-plan">
                <img src="${plan.imagen}" alt="${plan.titulo}">
            </div>

            <div class="info-plan">

                <h3>${plan.titulo}</h3>

                <p class="descripcion-plan">
                    ${plan.descripcion}
                </p>

                <div class="duracion-plan">
                    <span>◷</span>
                    ${plan.duracion}
                </div>

                <span class="ver-plan-relacionado">
                    Conocer este plan →
                </span>

            </div>

        `;

        tarjeta.addEventListener("click", event => {

            event.preventDefault();

            mostrarDetalle(plan.id);

        });

        contenedor.appendChild(tarjeta);

    });

}
// =========================================
// MOSTRAR DETALLE DE UN PLAN
// =========================================

function mostrarDetalle(id) {

    // Ocultar encabezado y tarjetas
    document.querySelector(".encabezado-planes").hidden = true;
    listadoPlanes.hidden = true;

    // Ocultar todos los detalles
    document.querySelectorAll(".detalle-plan").forEach(detalle => {
        detalle.hidden = true;
    });

    // Mostrar únicamente el detalle seleccionado
    const detalleSeleccionado = document.getElementById(`detalle-plan-${id}`);

    if (detalleSeleccionado) {

        detalleSeleccionado.hidden = false;

        // Cargar las opiniones del plan seleccionado
        cargarResenas(id);

        // Mostrar los otros planes disponibles
        mostrarPlanesRelacionados(id);

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// =========================================
// VOLVER AL LISTADO DE PLANES
// =========================================

document.querySelectorAll("[data-volver-planes]").forEach(boton => {

    boton.addEventListener("click", () => {

        // Ocultar todos los detalles
        document.querySelectorAll(".detalle-plan").forEach(detalle => {
            detalle.hidden = true;
        });

        // Mostrar nuevamente el encabezado y las tarjetas
        document.querySelector(".encabezado-planes").hidden = false;
        listadoPlanes.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});

// =========================================
// VENTANA EMERGENTE PARA COMPARTIR PLANES
// =========================================

const modalCompartir = document.getElementById("modal-compartir");
const cerrarModalCompartir = document.getElementById("cerrar-modal-compartir");
const nombrePlanCompartir = document.getElementById("nombre-plan-compartir");

const botonesAbrirCompartir = document.querySelectorAll(".boton-abrir-compartir");

let enlacePlanCompartir = "";

// Abrir ventana
botonesAbrirCompartir.forEach(boton => {

    boton.addEventListener("click", () => {

        const nombre = boton.dataset.nombrePlan;

        nombrePlanCompartir.textContent = nombre;

        enlacePlanCompartir = window.location.href;

        modalCompartir.hidden = false;

    });

});

// Cerrar ventana
cerrarModalCompartir.addEventListener("click", () => {
    modalCompartir.hidden = true;
});

// Cerrar al pulsar fuera de la ventana
modalCompartir.addEventListener("click", (e) => {

    if (e.target === modalCompartir) {
        modalCompartir.hidden = true;
    }

});

// Compartir por WhatsApp
document.getElementById("compartir-whatsapp").addEventListener("click", () => {

    const nombre = nombrePlanCompartir.textContent;

    const mensaje = `¡Mira este plan turístico de Wayra Kawsay: ${nombre}! ${enlacePlanCompartir}`;

    window.open(
        `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
        "_blank"
    );

});

// Compartir por Facebook
document.getElementById("compartir-facebook").addEventListener("click", () => {

    window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(enlacePlanCompartir)}`,
        "_blank"
    );

});

// Copiar enlace
document.getElementById("copiar-enlace-plan").addEventListener("click", async () => {

    const mensajeCopiar = document.getElementById("mensaje-copiar-enlace");

    try {

        await navigator.clipboard.writeText(enlacePlanCompartir);

        mensajeCopiar.textContent = "¡Enlace copiado correctamente!";

    } catch (error) {

        mensajeCopiar.textContent = "No fue posible copiar el enlace.";

    }

});




// =========================================
// SISTEMA DE ESTRELLAS DE LAS RESEÑAS
// =========================================

function inicializarEstrellas(formulario) {

    const grupos = formulario.querySelectorAll(".estrellas-calificacion");

    grupos.forEach(grupo => {

        const nombreCampo = grupo.dataset.campo;
        const campoOculto = formulario.querySelector(
            `input[name="${nombreCampo}"]`
        );

        const estrellas = grupo.querySelectorAll("button");

        function pintarEstrellas(valor) {

            estrellas.forEach(estrella => {

                const numero = Number(estrella.dataset.valor);

                estrella.classList.toggle(
                    "activa",
                    numero <= valor
                );

            });

        }

        // Al pasar el cursor, se muestra la calificación
        estrellas.forEach(estrella => {

            estrella.addEventListener("mouseenter", () => {
                pintarEstrellas(Number(estrella.dataset.valor));
            });

            // Al hacer clic, se guarda la puntuación
            estrella.addEventListener("click", () => {

                const valor = Number(estrella.dataset.valor);

                campoOculto.value = valor;

                pintarEstrellas(valor);

            });

        });

        // Al retirar el cursor, se conserva la selección
        grupo.addEventListener("mouseleave", () => {

            pintarEstrellas(Number(campoOculto.value) || 0);

        });

    });

}


// Inicializar las estrellas de ambos formularios
document.querySelectorAll(".formulario-resena form").forEach(formulario => {
    inicializarEstrellas(formulario);
});

// Guardar el ID de la reseña que se está editando
let resenaEnEdicion = null;


// =========================================
// CONSULTAR OPINIONES
// =========================================

async function cargarResenas(idPlan) {

    const contenedor = document.getElementById(`lista-resenas-${idPlan}`);

    try {

        const respuesta = await fetch(
            `${rutaResenas}reseñas_planes.php?accion=consultar&id_plan=${idPlan}`
        );

        const resultado = await respuesta.json();

        if (!resultado.exito) {
            contenedor.textContent = resultado.mensaje;
            return;
        }

        const resenas = resultado.datos.reseñas;
        const usuarioActual = resultado.datos.usuario_actual;

        contenedor.innerHTML = "";

        if (resenas.length === 0) {
            contenedor.textContent = "Todavía no hay opiniones para este plan.";
            return;
        }

        resenas.forEach(resena => {

            const tarjeta = document.createElement("div");
            tarjeta.classList.add("reseña-plan");

            const nombre = document.createElement("h3");
            nombre.textContent = resena.nombre_usuario;

            const comentario = document.createElement("p");
            comentario.textContent = resena.comentario;

            const puntuaciones = document.createElement("div");
            puntuaciones.classList.add("puntuaciones-reseña");

            const aspectos = [
                ["Alojamiento", resena.alojamiento],
                ["Alimentación", resena.alimentacion],
                ["Coordinación", resena.coordinacion],
                ["Destino", resena.destino],
                ["Transporte", resena.transporte],
                ["General", resena.general]
            ];

            aspectos.forEach(([nombreAspecto, valor]) => {

                const linea = document.createElement("p");

                linea.textContent =
                    `${nombreAspecto}: ${"★".repeat(Number(valor))}${"☆".repeat(5 - Number(valor))}`;

                puntuaciones.appendChild(linea);

            });

            const fecha = document.createElement("small");
            fecha.textContent = new Date(
                resena.fecha_creacion.replace(" ", "T")
            ).toLocaleDateString("es-CO");

            tarjeta.append(nombre, comentario, puntuaciones, fecha);

            // Mostrar opciones únicamente al propietario.
            if (
                usuarioActual !== null &&
                Number(usuarioActual) === Number(resena.id_usuario)
            ) {

                const botonEditar = document.createElement("button");
                botonEditar.type = "button";
                botonEditar.textContent = "Editar opinión";

                botonEditar.addEventListener("click", () => {
                    prepararEdicion(resena, idPlan);
                });

                const botonEliminar = document.createElement("button");
                botonEliminar.type = "button";
                botonEliminar.textContent = "Eliminar opinión";

               botonEliminar.addEventListener("click", () => {

    // Evitar que aparezcan varias confirmaciones
    if (tarjeta.querySelector(".confirmacion-eliminar")) {
        return;
    }

    const confirmacion = document.createElement("div");
    confirmacion.classList.add("confirmacion-eliminar");

    const mensajeConfirmacion = document.createElement("p");
    mensajeConfirmacion.textContent =
        "¿Estás segura de que deseas eliminar esta opinión?";

    const botonCancelar = document.createElement("button");
    botonCancelar.type = "button";
    botonCancelar.textContent = "Cancelar";
    botonCancelar.classList.add("cancelar-eliminar");

    const botonConfirmar = document.createElement("button");
    botonConfirmar.type = "button";
    botonConfirmar.textContent = "Sí, eliminar";
    botonConfirmar.classList.add("confirmar-eliminar");

    // Cancelar: cerrar la confirmación
    botonCancelar.addEventListener("click", () => {
        confirmacion.remove();
    });

    // Confirmar: ejecutar la eliminación
    botonConfirmar.addEventListener("click", async () => {

        botonConfirmar.disabled = true;
        botonConfirmar.textContent = "Eliminando...";

        await eliminarResena(resena.id_reseña, idPlan);

    });

    confirmacion.append(
        mensajeConfirmacion,
        botonCancelar,
        botonConfirmar
    );

    tarjeta.appendChild(confirmacion);

});

                tarjeta.append(botonEditar, botonEliminar);

            }

            contenedor.appendChild(tarjeta);

        });

    } catch (error) {

        console.error("Error al consultar opiniones:", error);

        contenedor.textContent = "No fue posible cargar las opiniones.";

    }

}


// =========================================
// PUBLICAR Y EDITAR OPINIONES
// =========================================

document.querySelectorAll(".formulario-resena form").forEach(formulario => {

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        const idPlan = Number(
            formulario.id.replace("form-resena-", "")
        );

        const mensaje = document.getElementById(`mensaje-resena-${idPlan}`);

        const datos = new FormData(formulario);

        datos.append("id_plan", idPlan);

        let archivoPHP = "reseñas_planes.php";

        if (resenaEnEdicion !== null) {

            archivoPHP = "editar_reseña_plan.php";

            datos.append("id_reseña", resenaEnEdicion);

        } else {

            datos.append("accion", "publicar");

        }

        try {

            const respuesta = await fetch(
                `${rutaResenas}${archivoPHP}`,
                {
                    method: "POST",
                    body: datos
                }
            );

            const resultado = await respuesta.json();

            mensaje.textContent = resultado.mensaje;

            if (!resultado.exito) {
                return;
            }

            formulario.reset();

            resenaEnEdicion = null;

            const botonPublicar = formulario.querySelector(
                'button[type="submit"]'
            );

            botonPublicar.textContent = "Publicar opinión";

            const botonCancelar = formulario.querySelector(".cancelar-edicion");

            if (botonCancelar) {
                botonCancelar.remove();
            }

           await cargarResenas(idPlan);
await mostrarPlanes();


        } catch (error) {

            console.error("Error al guardar opinión:", error);

            mensaje.textContent = "No fue posible procesar tu opinión.";

        }

    });

});


// =========================================
// PREPARAR EDICIÓN
// =========================================

function prepararEdicion(resena, idPlan) {

    const formulario = document.getElementById(`form-resena-${idPlan}`);

    resenaEnEdicion = resena.id_reseña;

    formulario.elements["alojamiento"].value = resena.alojamiento;
    formulario.elements["alimentacion"].value = resena.alimentacion;
    formulario.elements["coordinacion"].value = resena.coordinacion;
    formulario.elements["destino"].value = resena.destino;
    formulario.elements["transporte"].value = resena.transporte;
    formulario.elements["general"].value = resena.general;
    formulario.elements["comentario"].value = resena.comentario;

    formulario.querySelector('button[type="submit"]').textContent =
        "Guardar cambios";

    const mensaje = document.getElementById(`mensaje-resena-${idPlan}`);

    mensaje.textContent = "Estás editando tu opinión.";

    // Crear botón para cancelar la edición.
    let botonCancelar = formulario.querySelector(".cancelar-edicion");

    if (!botonCancelar) {

        botonCancelar = document.createElement("button");

        botonCancelar.type = "button";
        botonCancelar.classList.add("cancelar-edicion");
        botonCancelar.textContent = "Cancelar edición";

        formulario.appendChild(botonCancelar);

        botonCancelar.addEventListener("click", () => {

            formulario.reset();

            resenaEnEdicion = null;

            formulario.querySelector('button[type="submit"]').textContent =
                "Publicar opinión";

            botonCancelar.remove();

            mensaje.textContent = "";

        });

    }

    formulario.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =========================================
// ELIMINAR OPINIÓN
// =========================================
async function eliminarResena(idResena, idPlan) {

    const datos = new FormData();
    datos.append("id_reseña", idResena);

    try {

        const respuesta = await fetch(
            `${rutaResenas}eliminar_reseña_plan.php`,
            {
                method: "POST",
                body: datos
            }
        );

        const resultado = await respuesta.json();

        document.getElementById(`mensaje-resena-${idPlan}`).textContent =
            resultado.mensaje;

        if (resultado.exito) {
            await cargarResenas(idPlan);
            await mostrarPlanes();
        }

    } catch (error) {

        console.error("Error al eliminar opinión:", error);

        document.getElementById(`mensaje-resena-${idPlan}`).textContent =
            "No fue posible eliminar la opinión.";

    }

}
// =========================================
// VALIDACIÓN Y ENVÍO DE CONSULTAS
// =========================================

document.querySelectorAll(".formulario-consulta-plan").forEach(formulario => {

    const campos = formulario.querySelectorAll(
        "input[required], textarea[required]"
    );

    // Crear o eliminar mensajes de error
    function mostrarError(campo, mensaje) {

        campo.classList.add("invalido");

        let error = campo.nextElementSibling;

        if (!error || !error.classList.contains("mensaje-error-campo")) {
            error = document.createElement("small");
            error.classList.add("mensaje-error-campo");
            campo.insertAdjacentElement("afterend", error);
        }

        error.textContent = mensaje;
    }

    function limpiarError(campo) {

        campo.classList.remove("invalido");

        const error = campo.nextElementSibling;

        if (error && error.classList.contains("mensaje-error-campo")) {
            error.remove();
        }
    }

    // Quitar el aviso cuando la persona comienza a corregir
    campos.forEach(campo => {

        campo.addEventListener("input", () => {
            limpiarError(campo);
        });

    });

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        let formularioValido = true;

        // Revisar cada campo
        campos.forEach(campo => {

            limpiarError(campo);

            if (!campo.value.trim()) {

                mostrarError(campo, "Este campo es obligatorio.");
                formularioValido = false;

            } else if (
                campo.type === "email" &&
                !campo.validity.valid
            ) {

                mostrarError(campo, "Ingresa un correo electrónico válido.");
                formularioValido = false;

            }

        });

        if (!formularioValido) {
            return;
        }

        const detalle = formulario.closest(".detalle-plan");
        const idPlan = Number(detalle.id.replace("detalle-plan-", ""));

        const datos = new FormData(formulario);
        datos.append("id_plan", idPlan);

        const boton = formulario.querySelector('button[type="submit"]');
        const mensaje = formulario.querySelector(".respuesta-consulta");

        boton.disabled = true;
        boton.textContent = "Enviando...";
        mensaje.textContent = "";

        try {

            const respuesta = await fetch("../config/consultas_planes.php", {
                method: "POST",
                body: datos
            });

            const resultado = await respuesta.json();

            mensaje.textContent = resultado.mensaje;

            if (resultado.exito) {
                formulario.reset();

                campos.forEach(campo => limpiarError(campo));
            }

        } catch (error) {

            console.error("Error al enviar la consulta:", error);

            mensaje.textContent =
                "No fue posible enviar tu consulta. Inténtalo nuevamente.";

        } finally {

            boton.disabled = false;
            boton.textContent = "Enviar consulta";

        }

    });

});



/* =========================================
   CARRUSEL Y VISOR DE LA GALERÍA
========================================= */

// Desplazamiento de las galerías
document.querySelectorAll(".contenedor-carrusel").forEach(carrusel => {

    const galeria = carrusel.querySelector(".galeria-plan");
    const anterior = carrusel.querySelector(".flecha-galeria.anterior");
    const siguiente = carrusel.querySelector(".flecha-galeria.siguiente");

    anterior.addEventListener("click", () => {
        galeria.scrollBy({
            left: -galeria.clientWidth,
            behavior: "smooth"
        });
    });

    siguiente.addEventListener("click", () => {
        galeria.scrollBy({
            left: galeria.clientWidth,
            behavior: "smooth"
        });
    });

});


// Crear el visor ampliado
const visorGaleria = document.createElement("div");
visorGaleria.className = "visor-galeria";
visorGaleria.hidden = true;

visorGaleria.innerHTML = `
    <div class="contenido-visor-galeria">
        <button type="button" class="cerrar-visor-galeria"
            aria-label="Cerrar imagen">&times;</button>
        <div class="medio-visor-galeria"></div>
    </div>
`;

document.body.appendChild(visorGaleria);

const medioVisor = visorGaleria.querySelector(".medio-visor-galeria");
const cerrarVisor = visorGaleria.querySelector(".cerrar-visor-galeria");


// Abrir imagen o video al hacer clic
document.querySelectorAll(".foto-galeria").forEach(elemento => {

    elemento.addEventListener("click", () => {

        medioVisor.innerHTML = "";

        const tipo = elemento.dataset.tipo;

        if (tipo === "video") {

            const video = document.createElement("video");
            video.src = elemento.dataset.src;
            video.controls = true;
            video.autoplay = true;
            video.playsInline = true;

            medioVisor.appendChild(video);

        } else {

            const imagen = elemento.querySelector("img");

            if (!imagen) return;

            const imagenAmpliada = document.createElement("img");
            imagenAmpliada.src = imagen.src;
            imagenAmpliada.alt = imagen.alt;

            medioVisor.appendChild(imagenAmpliada);
        }

        visorGaleria.hidden = false;
    });

});


// Cerrar el visor
function cerrarGaleriaAmpliada() {
    visorGaleria.hidden = true;
    medioVisor.innerHTML = "";
}

cerrarVisor.addEventListener("click", cerrarGaleriaAmpliada);

visorGaleria.addEventListener("click", evento => {
    if (evento.target === visorGaleria) {
        cerrarGaleriaAmpliada();
    }
});

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && !visorGaleria.hidden) {
        cerrarGaleriaAmpliada();
    }
});
