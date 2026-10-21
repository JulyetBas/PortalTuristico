
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


/* ===== ABRIR DETALLES DESDE INICIO ===== */

const tarjetasInicio = document.querySelectorAll(
    ".destinos-destacados .card-destino"
);

tarjetasInicio.forEach(function (tarjeta) {
    const titulo = tarjeta.querySelector("h3");

    if (!titulo) return;

    const nombre = titulo.textContent.trim().toLowerCase();

    if (
        nombre === "laguna de la cocha" ||
        nombre === "santuario de las lajas" ||
        nombre === "volcan galeras"||
        nombre === "tumaco"||
        nombre === "museo del oro"  ||
        nombre === "las gradas de belen"||
        nombre === "laguna verde"
    ) {
        tarjeta.style.cursor = "pointer";

        tarjeta.addEventListener("click", function () {
            if (nombre === "laguna de la cocha") {
                window.location.href = "destinos.html?destino=cocha";
            } else if (nombre=="santuario de las lajas"){
                window.location.href = "destinos.html?destino=lajas";
            } else if (nombre=="volcan galeras"){
                window.location.href = "destinos.html?destino=volcan";
            } else if (nombre=="tumaco"){
                window.location.href = "destinos.html?destino=tumaco";
            } else if (nombre=="museo del oro"){
                window.location.href = "destinos.html?destino=museo";
            } else if (nombre=="las gradas de belen"){
                window.location.href = "destinos.html?destino=gradas";
            } else if (nombre=="laguna verde"){
                window.location.href = "destinos.html?destino=azufre";
            } 
        });
    }
});


/* ===== DETALLES DE LOS DESTINOS ===== */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Obtener los elementos del HTML
    const detalleCocha = document.getElementById("detalle-cocha");
    const detalleLajas = document.getElementById("detalle-lajas");
    const detalleVolcan = document.getElementById("detalle-volcan");
    const detalleTumaco = document.getElementById("detalle-tumaco");
    const detalleMuseo = document.getElementById("detalle-museo");
    const detalleGradas = document.getElementById("detalle-gradas");
    const detalleAzufre = document.getElementById("detalle-azufre");

    const cuadrillaDestinos = document.querySelector(".destinos-grid");
    const tarjetasDestinos = document.querySelectorAll(".card-destino");

    const botonesVolver = document.querySelectorAll(".btn-volver-destinos");

    const tituloDestinos = document.querySelector(".titulo-destinos");
    const buscadorDestinos = document.querySelector(".buscador-destinos");
    const panelFiltros = document.getElementById("panel-filtros");

    // Imágenes de La Cocha
    const imagenPrincipalCocha = document.getElementById("imagen-principal-cocha");
    const miniaturasCocha = document.querySelectorAll(".miniatura-cocha");
    

    // Imágenes de Las Lajas
    const imagenPrincipalLajas = document.getElementById("imagen-principal-lajas");
    const miniaturasLajas = document.querySelectorAll(".miniatura-lajas");

// Imágenes de el Volcan
    const imagenPrincipalVolcan = document.getElementById("imagen-principal-volcan");
    const miniaturasVolcan = document.querySelectorAll(".miniatura-volcan");

    // Imágenes de Tumaco
    const imagenPrincipalTumaco = document.getElementById("imagen-principal-tumaco");
    const miniaturasTumaco = document.querySelectorAll(".miniatura-tumaco");
    // Imágenes de el Museo
    const imagenPrincipalMuseo = document.getElementById("imagen-principal-museo");
    const miniaturasMuseo = document.querySelectorAll(".miniatura-museo");
    // Imágenes de Las gradas de Belen
    const imagenPrincipalGradas = document.getElementById("imagen-principal-gradas");
    const miniaturasGradas = document.querySelectorAll(".miniatura-gradas");

    // Imágenes de La Lajuna verde
    const imagenPrincipalAzufre = document.getElementById("imagen-principal-azufre");
    const miniaturasAzufre = document.querySelectorAll(".miniatura-azufre");

    // 2. Comprobar que existen los elementos principales
    if (!detalleCocha || !detalleLajas || !detalleVolcan|| !detalleTumaco|| !detalleMuseo ||!detalleGradas ||!detalleAzufre || !cuadrillaDestinos) {
        console.error("No se encontraron los contenedores de los destinos.");
        return;
    }

    // 3. Ocultar el listado y sus controles
    function ocultarListado() {
        cuadrillaDestinos.hidden = true;

        if (tituloDestinos) tituloDestinos.hidden = true;
        if (buscadorDestinos) buscadorDestinos.hidden = true;
        if (panelFiltros) panelFiltros.hidden = true;
    }

    // 4. Mostrar el detalle de La Cocha
    function mostrarDetalleCocha() {
        detalleLajas.hidden = true;
        detalleCocha.hidden = false;
        detalleVolcan.hidden = true;
detalleTumaco.hidden = true;
detalleMuseo.hidden = true;
detalleGradas.hidden = true;
detalleAzufre.hidden = true;
        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // 5. Mostrar el detalle de Las Lajas
    function mostrarDetalleLajas() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = false;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // 5. Mostrar el detalle del Volcan
    function mostrarDetalleVolcan() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = false;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
     // 5. Mostrar el detalle de Tumaco
    function mostrarDetalleTumaco() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = false;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
     // 5. Mostrar el detalle de Museo
    function mostrarDetalleMuseo() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = false;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
     // 5. Mostrar el detalle de Gradas de Belen
    function mostrarDetalleGradas() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = false;
        detalleAzufre.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    // 5. Mostrar el detalle de Laguna Verde
    function mostrarDetalleAzufre() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = false;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // 6. Volver al listado de destinos
    function volverADestinos() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleAzufre.hidden = true;

        cuadrillaDestinos.hidden = false;

        if (tituloDestinos) tituloDestinos.hidden = false;
        if (buscadorDestinos) buscadorDestinos.hidden = false;
        if (panelFiltros) panelFiltros.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // 7. Detectar qué tarjeta selecciona el usuario
    tarjetasDestinos.forEach(function (tarjeta) {
        const titulo = tarjeta.querySelector("h3");

        if (!titulo) return;

        const nombre = titulo.textContent.trim().toLowerCase();

        if (nombre === "laguna de la cocha") {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleCocha();
            });
        }

        if (
            nombre === "las lajas" ||
            nombre === "santuario de las lajas"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleLajas();
            });
        }
        if (
            nombre === "volcan galeras"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleVolcan();
            });
        }if (
            nombre === "tumaco"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleTumaco();
            });
        }if (
            nombre === "museo del oro"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleMuseo();
            });
        }
        if (
            nombre === "las gradas de belen"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleGradas();
            });
        }
        if (
            nombre === "laguna verde"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleAzufre();
            });
        }
    });

    // 8. Hacer que ambos botones regresen al listado
    botonesVolver.forEach(function (boton) {
        boton.addEventListener("click", volverADestinos);
    });

    // 9. Cambiar las imágenes de La Cocha
    miniaturasCocha.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalCocha) {
                imagenPrincipalCocha.src = nuevaImagen;
            }
        });
    });

    // 10. Cambiar las imágenes de Las Lajas
    miniaturasLajas.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalLajas) {
                imagenPrincipalLajas.src = nuevaImagen;
            }
        });
    });

 // 10. Cambiar las imágenes de el Volcan
    miniaturasVolcan.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalVolcan) {
                imagenPrincipalVolcan.src = nuevaImagen;
            }
        });
    });

    // 10. Cambiar las imágenes de Tumaco
    miniaturasTumaco.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalTumaco) {
                imagenPrincipalTumaco.src = nuevaImagen;
            }
        });
    });
    // 10. Cambiar las imágenes del Museo
    miniaturasMuseo.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalMuseo) {
                imagenPrincipalMuseo.src = nuevaImagen;
            }
        });
    });
    // 10. Cambiar las imágenes de las Grdaas de belen
    miniaturasGradas.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalGradas) {
                imagenPrincipalGradas.src = nuevaImagen;
            }
        });
    });
    // 10. Cambiar las imágenes de l laguna Verde
    miniaturasAzufre.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalAzufre) {
                imagenPrincipalAzufre.src = nuevaImagen;
            }
        });
    });









        // 11. Abrir el destino solicitado desde otra página
    const parametros = new URLSearchParams(window.location.search);
    const destinoSolicitado = parametros.get("destino");

    if (destinoSolicitado === "cocha") {
        mostrarDetalleCocha();
    }

    if (destinoSolicitado === "lajas") {
        mostrarDetalleLajas();
    }

    if (destinoSolicitado === "volcan") {
        mostrarDetalleVolcan();
    }
     if (destinoSolicitado === "tumaco") {
        mostrarDetalleTumaco();
    }
     if (destinoSolicitado === "museo") {
        mostrarDetalleMuseo();
    }
     if (destinoSolicitado === "gradas") {
        mostrarDetalleGradas();
    }
    if (destinoSolicitado === "azufre") {
        mostrarDetalleGradas();
    }

});
