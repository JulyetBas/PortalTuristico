
// =====================================
// INFORMACIÓN DE LOS PLANES
// =====================================

const planes = [

    {
        id: 1,
        titulo: "Nariño Natural",
        descripcion: "Una experiencia para disfrutar de los paisajes naturales de Nariño, recorrer lugares sorprendentes y conectar con la tranquilidad de sus entornos.",
        duracion: "6 días · 5 noches",
        imagen: "imagenes/pajarop.webp",
        reseñas: 24,
        publicado: "hace 2 días"
    },

   {
    id: 2,
    titulo: "Nariño de Fe y Tradición",
    descripcion: "Descubre la riqueza religiosa y cultural de Nariño a través de sus templos y santuarios más representativos, y disfruta de una experiencia de descanso en las aguas termales de Ambiaku.",
    duracion: "5 días · 4 noches",
    imagen: "imagenes/plan-fe-tradicion.jpg",
    reseñas: 0,
    publicado: "hace 5 días"
}

];


// =====================================
// MOSTRAR LAS TARJETAS
// =====================================

const listadoPlanes = document.getElementById("listado-planes");

function mostrarPlanes() {

    listadoPlanes.innerHTML = "";

    planes.forEach(plan => {

       const tarjeta = document.createElement("a");
tarjeta.classList.add("tarjeta-plan");
tarjeta.href = `#detalle-plan-${plan.id}`;

tarjeta.addEventListener("click", (event) => {
    event.preventDefault();
    mostrarDetalle(plan.id);
});

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

                ${plan.reseñas > 0 ? `
                    <div class="calificacion-plan">
                        <span class="estrellas-plan">★★★★★</span>
                        <span class="cantidad-reseñas">
                            (${plan.reseñas} reseñas)
                        </span>
                    </div>
                ` : ""}

                <div class="publicacion-plan">
                    <span>◷</span>
                    Publicado ${plan.publicado}
                </div>

            </div>

        `;

        listadoPlanes.appendChild(tarjeta);

    });

}


// =====================================
// INICIAR
// =====================================

mostrarPlanes();


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

