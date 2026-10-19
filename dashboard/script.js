
/* ===== CARRUSEL INICIO===== */

const carrusel = document.querySelector(".carrusel");

if (carrusel) {
    const fotos = carrusel.querySelectorAll(".foto-slide");
    const puntos = carrusel.querySelectorAll(".punto");
    const botonAnterior = carrusel.querySelector(".flecha.anterior");
    const botonSiguiente = carrusel.querySelector(".flecha.siguiente");

    let actual = 0;
    let temporizador;

    function mostrarFoto(indice) {
        fotos[actual].classList.remove("activa");
        puntos[actual].classList.remove("activo");

        actual = (indice + fotos.length) % fotos.length;

        fotos[actual].classList.add("activa");
        puntos[actual].classList.add("activo");
    }

    function reiniciarTemporizador() {
        clearInterval(temporizador);

        temporizador = setInterval(() => {
            mostrarFoto(actual + 1);
        }, 5000);
    }

    botonSiguiente.addEventListener("click", () => {
        mostrarFoto(actual + 1);
        reiniciarTemporizador();
    });

    botonAnterior.addEventListener("click", () => {
        mostrarFoto(actual - 1);
        reiniciarTemporizador();
    });

    puntos.forEach((punto, indice) => {
        punto.addEventListener("click", () => {
            mostrarFoto(indice);
            reiniciarTemporizador();
        });
    });

    reiniciarTemporizador();
}




/* MOSTRAR Y OCULTAR FILTROS */

const botonFiltros = document.getElementById("btn-filtros");
const panelFiltros = document.getElementById("panel-filtros");

if (botonFiltros && panelFiltros) {
    botonFiltros.addEventListener("click", function () {
        const abierto = botonFiltros.getAttribute("aria-expanded") === "true";

        panelFiltros.hidden = abierto;
        botonFiltros.setAttribute("aria-expanded", String(!abierto));
    });
}

/* ACTUALIZAR PRECIO */

const rangoPrecio = document.getElementById("rango-precio");
const precioActual = document.getElementById("precio-actual");

if (rangoPrecio && precioActual) {
    rangoPrecio.addEventListener("input", function () {
        precioActual.textContent = "$" +
            Number(rangoPrecio.value).toLocaleString("es-CO");
    });
}




/* ===== DETALLE DE LAGUNA DE LA COCHA ===== */

document.addEventListener("DOMContentLoaded", function () {

    const detalleCocha = document.getElementById("detalle-cocha");
    const botonVolver = document.getElementById("volver-destinos");
    const cuadrillaDestinos = document.querySelector(".destinos-grid");

    const tituloDestinos = document.querySelector(".titulo-destinos");
const buscadorDestinos = document.querySelector(".buscador-destinos");
const panelFiltros = document.getElementById("panel-filtros");
    const tarjetasDestinos = document.querySelectorAll(".card-destino");
    const imagenPrincipal = document.getElementById("imagen-principal-cocha");
    const miniaturasCocha = document.querySelectorAll(".miniatura-cocha");

    // Comprobar que los elementos necesarios existen
    if (!detalleCocha || !cuadrillaDestinos || !botonVolver) {
        return;
    }

    // Mostrar el detalle de La Cocha
    

function mostrarDetalleCocha() {
    cuadrillaDestinos.hidden = true;
    
detalleCocha.hidden = false;

    if (tituloDestinos) tituloDestinos.hidden = true;
    if (buscadorDestinos) buscadorDestinos.hidden = true;
    if (panelFiltros) panelFiltros.hidden = true;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



    // Volver a mostrar las tarjetas
    
function volverADestinos() {
    detalleCocha.hidden = true;
    cuadrillaDestinos.hidden = false;

    if (tituloDestinos) tituloDestinos.hidden = false;
    if (buscadorDestinos) buscadorDestinos.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


    // Detectar el clic en la tarjeta de La Cocha
    tarjetasDestinos.forEach(function (tarjeta) {
        const titulo = tarjeta.querySelector("h3");

        if (
            titulo &&
            titulo.textContent.trim().toLowerCase() === "laguna de la cocha"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleCocha();
            });
        }
    });

    // Volver a la cuadrícula de destinos
    botonVolver.addEventListener("click", volverADestinos);

    // Cambiar la imagen principal al pulsar una miniatura
    miniaturasCocha.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipal) {
                imagenPrincipal.src = nuevaImagen;
            }
        });
    });

});
