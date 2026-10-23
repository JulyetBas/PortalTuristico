
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
        nombre === "volcan galeras" ||
        nombre === "tumaco" ||
        nombre === "museo del oro" ||
        nombre === "las gradas de belen" ||
        nombre === "laguna de la cruz-tajumbina"||
        nombre === "katza-pi"
    ) {
        tarjeta.style.cursor = "pointer";

        tarjeta.addEventListener("click", function () {
            if (nombre === "laguna de la cocha") {
                window.location.href = "destinos.html?destino=cocha";
            } else if (nombre == "santuario de las lajas") {
                window.location.href = "destinos.html?destino=lajas";
            } else if (nombre == "volcan galeras") {
                window.location.href = "destinos.html?destino=volcan";
            } else if (nombre == "tumaco") {
                window.location.href = "destinos.html?destino=tumaco";
            } else if (nombre == "museo del oro") {
                window.location.href = "destinos.html?destino=museo";
            } else if (nombre == "las gradas de belen") {
                window.location.href = "destinos.html?destino=gradas";
            } else if (nombre == "laguna de la cruz-tajumbina") {
                window.location.href = "destinos.html?destino=cruz";
            }else if (nombre == "katza-pi") {
                window.location.href = "destinos.html?destino=pi";
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
    const detalleCruz = document.getElementById("detalle-cruz");
    const detallePi = document.getElementById("detalle-pi");

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
    const imagenPrincipalCruz = document.getElementById("imagen-principal-cruz");
    const miniaturasCruz = document.querySelectorAll(".miniatura-cruz");

    // Imágenes de La Katza pi
    const imagenPrincipalPi = document.getElementById("imagen-principal-pi");
    const miniaturasPi = document.querySelectorAll(".miniatura-pi");

    // 2. Comprobar que existen los elementos principales
    if (!detalleCocha || !detalleLajas || !detalleVolcan || !detalleTumaco || !detalleMuseo || !detalleGradas || !detalleCruz ||!detallePi ||  !cuadrillaDestinos) {
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
        detalleCruz.hidden = true;
        detallePi.hidden = true;
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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    // 5. Mostrar el detalle de Laguna de la cruz
    function mostrarDetalleCruz() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleCruz.hidden = false;
        detallePi.hidden = true;

        ocultarListado();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    // 5. Mostrar el detalle de Katzu-pi
    function mostrarDetallePi() {
        detalleCocha.hidden = true;
        detalleLajas.hidden = true;
        detalleVolcan.hidden = true;
        detalleTumaco.hidden = true;
        detalleMuseo.hidden = true;
        detalleGradas.hidden = true;
        detalleCruz.hidden = true;
        detallePi.hidden = false;

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
        detalleCruz.hidden = true;
        detallePi.hidden = true;

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
        } if (
            nombre === "tumaco"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleTumaco();
            });
        } if (
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
            nombre === "laguna de la cruz-tajumbina"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetalleCruz();
            });
        }
         if (
            nombre === "katza-pi"
        ) {
            tarjeta.style.cursor = "pointer";

            tarjeta.addEventListener("click", function () {
                mostrarDetallePi();
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
    // 10. Cambiar las imágenes de la laguna de la cruz
    miniaturasCruz.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalCruz) {
                imagenPrincipalCruz.src = nuevaImagen;
            }
        });
    });
 // 10. Cambiar las imágenes de la laguna de la cruz
    miniaturasPi.forEach(function (miniatura) {
        miniatura.addEventListener("click", function () {
            const nuevaImagen = miniatura.dataset.imagen;

            if (nuevaImagen && imagenPrincipalPi) {
                imagenPrincipalPi.src = nuevaImagen;
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
    if (destinoSolicitado === "cruz") {
        mostrarDetalleCruz();

    }if (destinoSolicitado === "pi") {
        mostrarDetallePi();
    }

});


document.addEventListener("DOMContentLoaded", () => {

    const buscador = document.getElementById("busqueda-destinos");
    const botonFiltros = document.getElementById("btn-filtros");
    const panelFiltros = document.getElementById("panel-filtros");

    const filtroTipo = document.getElementById("tipo-destino");
    const filtroUbicacion = document.getElementById("ubicacion-destino");
    const rangoPrecio = document.getElementById("rango-precio");
    const precioActual = document.getElementById("precio-actual");

    const tarjetas = document.querySelectorAll(
        ".destinos-grid .card-destino"
    );
    const mensajeSinResultados = document.getElementById(
    "mensaje-sin-resultados"
);

    // Normaliza el texto para ignorar mayúsculas y tildes.
    function normalizar(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    // Convierte un precio como "$150.000 COP" en 150000.
    function obtenerPrecio(tarjeta) {
        const bloques = tarjeta.querySelectorAll(
            ".destino-datos .dato-destino"
        );

        for (const bloque of bloques) {
            const etiqueta = bloque.querySelector("span");
            const valor = bloque.querySelector("p");

            if (
                etiqueta &&
                valor &&
                normalizar(etiqueta.textContent).includes("precio")
            ) {
                const numeros = valor.textContent.match(/[\d.]+/);

                if (numeros) {
                    return Number(numeros[0].replace(/\./g, ""));
                }

                return null;
            }
        }

        return null;
    }

    
    
    // Mostrar u ocultar el panel de filtros.
    botonFiltros.addEventListener("click", () => {
        const abierto = !panelFiltros.hidden;

        panelFiltros.hidden = abierto;
        botonFiltros.setAttribute("aria-expanded", String(!abierto));

        // Al cerrar el panel, restablecer los filtros.
        if (abierto) {
            filtroTipo.value = "todos";
            filtroUbicacion.value = "todas";
            rangoPrecio.value = rangoPrecio.max;

            filtrarDestinos();
        }
    });


    // Aplicar búsqueda, categoría, ubicación y precio.
    function filtrarDestinos() {
        const texto = normalizar(buscador.value);
        const tipo = normalizar(filtroTipo.value).replace(/-/g, " ");
        const ubicacion = normalizar(filtroUbicacion.value)
            .replace(/-/g, " ");

        const precioMaximo = Number(rangoPrecio.value);
        const precioMaximoGeneral = Number(rangoPrecio.max);

        precioActual.textContent =
            "$" + precioMaximo.toLocaleString("es-CO");

        tarjetas.forEach((tarjeta) => {
            const nombre = normalizar(
                tarjeta.querySelector("h3")?.textContent || ""
            );

            const categoria = normalizar(
                tarjeta.querySelector(".destino-categoria")
                    ?.textContent || ""
            );

            const lugar = normalizar(
                tarjeta.querySelector(".destino-ubicacion")
                    ?.textContent || ""
            );

            const precio = obtenerPrecio(tarjeta);

            const coincideTexto =
                nombre.includes(texto) ||
                categoria.includes(texto) ||
                lugar.includes(texto);

            const coincideTipo =
                tipo === "todos" || categoria === tipo;

            const coincideUbicacion =
                ubicacion === "todas" || lugar.includes(ubicacion);

            // Si no hay precio registrado, solo se incluye
            // cuando el rango permanece en su máximo general.
            const coincidePrecio =
                precio !== null
                    ? precio <= precioMaximo
                    : precioMaximo === precioMaximoGeneral;

            tarjeta.style.display =
                coincideTexto &&
                coincideTipo &&
                coincideUbicacion &&
                coincidePrecio
                    ? ""
                    : "none";
        });

                const hayResultados = Array.from(tarjetas).some(
            tarjeta => tarjeta.style.display !== "none"
        );

        mensajeSinResultados.hidden = hayResultados;
    }

    // Escuchar los cambios de cada control.
    buscador.addEventListener("input", filtrarDestinos);
    filtroTipo.addEventListener("change", filtrarDestinos);
    filtroUbicacion.addEventListener("change", filtrarDestinos);
    rangoPrecio.addEventListener("input", filtrarDestinos);

    // Aplicar el estado inicial.
    filtrarDestinos();

});




/* ===== DETALLES DE EVENTOS ===== */

document.addEventListener("DOMContentLoaded", function () {

    const listaEventos = document.querySelector(".lista-eventos");
    const detalleCarnaval = document.getElementById("detalle-evento-carnaval");
   const detalleCuy = document.getElementById("detalle-evento-cuy");
   const detalleCurrulao = document.getElementById("detalle-evento-currulao");
   const detalleRosario = document.getElementById("detalle-evento-rosario");
   const detalleMusica = document.getElementById("detalle-evento-musica")

    const tituloEventos = document.querySelector(".titulo-destinos");
    const tarjetaCarnaval = document.querySelector(
        '.tarjeta-evento-detalle[data-evento="carnaval"]'
    );
    const tarjetaCuy = document.querySelector(
        '.tarjeta-evento-detalle[data-evento="cuy"]'
    );
    const tarjetaCurrulao = document.querySelector(
        '.tarjeta-evento-detalle[data-evento="currulao"]'
    );
     const tarjetaRosario = document.querySelector(
        '.tarjeta-evento-detalle[data-evento="rosario"]'
    );
    const tarjetaMusica = document.querySelector(
        '.tarjeta-evento-detalle[data-evento="musica"]'
    );

     
const botonesVolver = document.querySelectorAll(".btn-volver-eventos");

    const imagenPrincipal = document.getElementById("imagen-grande-carnaval");
    
    const miniaturas = document.querySelectorAll(".miniatura-evento");

    // Ejecutar este código solo en la página de Eventos.
    if (!listaEventos || !detalleCarnaval|| !detalleCuy|| !detalleCurrulao|| !detalleRosario|| !detalleMusica) return;

    // Mostrar el detalle del Carnaval.
    function mostrarDetalleCarnaval(actualizarURL = true) {
        listaEventos.hidden = true;
        if (tituloEventos) tituloEventos.hidden = true;

        detalleCarnaval.hidden = false;

        if (actualizarURL) {
            window.history.pushState(
                { evento: "carnaval" },
                "",
                "eventos.html?evento=carnaval"
            );
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

// Mostrar el detalle del Cuy
    function mostrarDetalleCuy(actualizarURL = true) {
        listaEventos.hidden = true;
        if (tituloEventos) tituloEventos.hidden = true;

        detalleCuy.hidden = false;

        if (actualizarURL) {
            window.history.pushState(
                { evento: "cuy" },
                "",
                "eventos.html?evento=cuy"
            );
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    // Mostrar el detalle del Currulao.
    function mostrarDetalleCurrulao(actualizarURL = true) {
        listaEventos.hidden = true;
        if (tituloEventos) tituloEventos.hidden = true;

        detalleCurrulao.hidden = false;

        if (actualizarURL) {
            window.history.pushState(
                { evento: "currulao" },
                "",
                "eventos.html?evento=currulao"
            );
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Mostrar el detalle Rosario.
    function mostrarDetalleRosario(actualizarURL = true) {
        listaEventos.hidden = true;
        if (tituloEventos) tituloEventos.hidden = true;

        detalleRosario.hidden = false;

        if (actualizarURL) {
            window.history.pushState(
                { evento: "rosario" },
                "",
                "eventos.html?evento=rosario"
            );
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    // Mostrar el detalle de musica.
    function mostrarDetalleMusica(actualizarURL = true) {
        listaEventos.hidden = true;
        if (tituloEventos) tituloEventos.hidden = true;

        detalleMusica.hidden = false;

        if (actualizarURL) {
            window.history.pushState(
                { evento: "musica" },
                "",
                "eventos.html?evento=musica"
            );
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }









    // Volver al listado de eventos.
    function volverAEventos() {
        detalleCarnaval.hidden = true;
        detalleCuy.hidden = true;
        detalleCurrulao.hidden = true;
        detalleRosario.hidden = true;
        detalleMusica.hidden = true;

        listaEventos.hidden = false;
        if (tituloEventos) tituloEventos.hidden = false;

        window.history.pushState({}, "", "eventos.html");

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Abrir el detalle al pulsar cada tarjeta.
if (tarjetaCarnaval) {
    tarjetaCarnaval.addEventListener("click", function () {
        mostrarDetalleCarnaval();
    });
}

if (tarjetaCuy) {
    tarjetaCuy.addEventListener("click", function () {
        mostrarDetalleCuy();
    });
}

if (tarjetaCurrulao) {
    tarjetaCurrulao.addEventListener("click", function () {
        mostrarDetalleCurrulao();
    });
}
if (tarjetaRosario) {
    tarjetaRosario.addEventListener("click", function () {
        mostrarDetalleRosario();
    });
}
if (tarjetaMusica) {
    tarjetaMusica.addEventListener("click", function () {
        mostrarDetalleMusica();
    });
}

    

  // Conectar todos los botones para regresar.
botonesVolver.forEach(function (boton) {
    boton.addEventListener("click", volverAEventos);
});

  
    // Cambiar la imagen principal al pulsar una miniatura.
    miniaturas.forEach(function (miniatura) {
        miniatura.addEventListener("click", function (evento) {
            evento.stopPropagation();

            // Identificar a qué evento pertenece la miniatura.
            const detalle = miniatura.closest(".detalle-evento");

            if (!detalle) return;

            // Buscar la imagen principal de ese evento.
            const imagenPrincipal = detalle.querySelector(
                'img[id^="imagen-grande-"]'
            );

            if (imagenPrincipal && miniatura.dataset.imagen) {
                imagenPrincipal.src = miniatura.dataset.imagen;
                imagenPrincipal.alt = miniatura.dataset.alt || "";
            }

            // Marcar solo la miniatura seleccionada en esa galería.
            detalle.querySelectorAll(".miniatura-evento").forEach(
                function (otra) {
                    otra.classList.remove("activa");
                }
            );

            miniatura.classList.add("activa");
        });
    });


    // Abrir directamente el detalle si se llega desde Inicio.
    const parametros = new URLSearchParams(window.location.search);

    if (parametros.get("evento") === "carnaval") {
        mostrarDetalleCarnaval(false);
    }
     if (parametros.get("evento") === "cuy") {
        mostrarDetalleCuy(false);
    }
     if (parametros.get("evento") === "currulao") {
        mostrarDetalleCurrulao(false);
    }
    if (parametros.get("evento") === "rosario") {
        mostrarDetalleRosario(false);
    }
    if (parametros.get("evento") === "musica") {
        mostrarDetalleMusica(false);
    }

});

