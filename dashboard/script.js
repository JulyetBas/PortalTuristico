
/* ACTUALIZAR PRECIO */

const rangoPrecio = document.getElementById("rango-precio");
const precioActual = document.getElementById("precio-actual");

if (rangoPrecio && precioActual) {
    rangoPrecio.addEventListener("input", function () {
        precioActual.textContent = "$" +
            Number(rangoPrecio.value).toLocaleString("es-CO");
    });
}

/* ===== ABRIR DETALLES DESDE INICIO EVENTOS ===== */


/* ===== ABRIR EVENTOS DESDE INICIO ===== */

const tarjetasEventosInicio = document.querySelectorAll(
    ".eventos-proximos .card-evento"
);

tarjetasEventosInicio.forEach(function (tarjeta) {
    tarjeta.style.cursor = "pointer";

    tarjeta.addEventListener("click", function () {
        const titulo = tarjeta.querySelector("h3");

        if (!titulo) return;

        const nombre = titulo.textContent
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (nombre === "carnaval de negros y blancos") {
            window.location.href = "eventos.html?evento=carnaval";
        } else if (nombre === "festival del cuy y cultura campesina") {
            window.location.href = "eventos.html?evento=cuy";
        } else if (nombre === "festival internacional del currulao") {
            window.location.href = "eventos.html?evento=currulao";
        } else if (nombre === "fiesta de la virgen del rosario") {
            window.location.href = "eventos.html?evento=rosario";
        } else if (nombre === "festival de musica de cuerdas") {
            window.location.href = "eventos.html?evento=musica";
        }
    });
});



/* ===== ABRIR DETALLES DESDE INICIO  DESTINOS===== */

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
    
    // Cambiar la imagen principal al pulsar una miniatura.
    miniaturas.forEach(function (miniatura) {
        miniatura.addEventListener("click", function (evento) {
            evento.stopPropagation();

            const detalle = miniatura.closest(".detalle-evento");

            if (!detalle) return;

            const imagenPrincipal = detalle.querySelector(
                'img[id^="imagen-grande-"]'
            );

            if (imagenPrincipal && miniatura.dataset.imagen) {
                imagenPrincipal.src = miniatura.dataset.imagen;
                imagenPrincipal.alt = miniatura.dataset.alt || "";

                // Ajustar la posición de cada fotografía.
                imagenPrincipal.style.objectPosition =
                    miniatura.dataset.posicion || "center 50%";
            }

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





/* ===== PUBLICAR RESEÑAS DE DESTINOS ===== */

document.addEventListener("DOMContentLoaded", function () {

    const formulariosResena = document.querySelectorAll(".form-resena");

    formulariosResena.forEach(function (formulario) {

        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();
            

            const destino = formulario.dataset.destino;
            const calificacion = formulario.querySelector(
                'input[name="calificacion"]:checked'
            );
            const comentario = formulario.querySelector(
                'textarea[name="comentario"]'
            );
            const mensaje = formulario.querySelector(".mensaje-resena");
            const boton = formulario.querySelector(
                'button[type="submit"]'
            );
if (!calificacion) {
    mensaje.textContent = "Selecciona una calificación.";
    return;
}

            const datos = new FormData();
            datos.append("destino", destino);
            datos.append("calificacion", calificacion.value);
            datos.append("comentario", comentario.value.trim());

            boton.disabled = true;
            mensaje.textContent = "Publicando reseña...";

            try {
                const respuesta = await fetch("../config/guardar_reseña.php", {
                    method: "POST",
                    body: datos,
                    credentials: "same-origin"
                });

                const resultado = await respuesta.json();

                mensaje.textContent = resultado.mensaje;

                if (resultado.exito) {
                    formulario.reset();
                }

            } catch (error) {
                mensaje.textContent =
                    "No se pudo conectar con el servidor. Inténtalo de nuevo.";
            } finally {
                boton.disabled = false;
            }
        });

    });

});


/* ===== CARGAR RESEÑAS DE LOS OCHO DESTINOS ===== */


/* ===== CARGAR RESEÑAS DE LOS OCHO DESTINOS ===== */

document.addEventListener("DOMContentLoaded", function () {
    const destinos = [
        "cocha", "lajas", "volcan", "tumaco",
        "museo", "gradas", "cruz", "pi"
    ];

    function crearElemento(etiqueta, texto, clase) {
        const elemento = document.createElement(etiqueta);
        elemento.textContent = texto;
        if (clase) elemento.className = clase;
        return elemento;
    }

    // Crear una ventana personalizada para editar o eliminar.
    function crearModal(tipo, resena) {
        return new Promise(function (resolver) {
            const fondo = document.createElement("div");
            fondo.className = "modal-resena-fondo";

            const modal = document.createElement("section");
            modal.className = "modal-resena";
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");

            const titulo = crearElemento(
                "h3",
                tipo === "editar" ? "Editar reseña" : "Eliminar reseña"
            );

            const descripcion = crearElemento(
                "p",
                tipo === "editar"
                    ? "Modifica tu calificación y tu comentario."
                    : "¿Estás segura de que deseas eliminar esta reseña?"
            );

            modal.append(titulo, descripcion);

            let calificacion;
            let comentario;

            if (tipo === "editar") {
                const etiquetaCalificacion = crearElemento(
                    "label", "Tu calificación"
                );
                etiquetaCalificacion.htmlFor = "modal-calificacion";

                calificacion = document.createElement("select");
                calificacion.id = "modal-calificacion";
                calificacion.className = "campo-modal-resena";

                [
                    ["5", "★★★★★ — Excelente"],
                    ["4", "★★★★☆ — Muy buena"],
                    ["3", "★★★☆☆ — Buena"],
                    ["2", "★★☆☆☆ — Regular"],
                    ["1", "★☆☆☆☆ — Mala"]
                ].forEach(function (opcion) {
                    const elemento = document.createElement("option");
                    elemento.value = opcion[0];
                    elemento.textContent = opcion[1];
                    if (Number(opcion[0]) === Number(resena.calificacion)) {
                        elemento.selected = true;
                    }
                    calificacion.appendChild(elemento);
                });

                const etiquetaComentario = crearElemento(
                    "label", "Tu comentario"
                );
                etiquetaComentario.htmlFor = "modal-comentario";

                comentario = document.createElement("textarea");
                comentario.id = "modal-comentario";
                comentario.className = "campo-modal-resena";
                comentario.rows = 4;
                comentario.maxLength = 1000;
                comentario.value = resena.comentario || "";
                comentario.placeholder = "Escribe tu experiencia...";

                modal.append(
                    etiquetaCalificacion,
                    calificacion,
                    etiquetaComentario,
                    comentario
                );
            }

            const mensaje = crearElemento("p", "", "mensaje-modal-resena");
            mensaje.setAttribute("aria-live", "polite");

            const acciones = document.createElement("div");
            acciones.className = "acciones-modal-resena";

            const cancelar = crearElemento(
                "button", "Cancelar", "btn-modal-cancelar"
            );
            cancelar.type = "button";

            const aceptar = crearElemento(
                "button",
                tipo === "editar" ? "Guardar cambios" : "Sí, eliminar",
                tipo === "editar"
                    ? "btn-modal-guardar"
                    : "btn-modal-eliminar"
            );
            aceptar.type = "button";

            acciones.append(cancelar, aceptar);
            modal.append(mensaje, acciones);
            fondo.appendChild(modal);
            document.body.appendChild(fondo);

            function cerrar(valor) {
                document.removeEventListener("keydown", teclaEscape);
                fondo.remove();
                resolver(valor);
            }

            function teclaEscape(evento) {
                if (evento.key === "Escape") cerrar(null);
            }

            cancelar.addEventListener("click", () => cerrar(null));

            fondo.addEventListener("click", function (evento) {
                if (evento.target === fondo) cerrar(null);
            });

            document.addEventListener("keydown", teclaEscape);

            aceptar.addEventListener("click", function () {
                if (tipo === "editar") {
                    const texto = comentario.value.trim();

                    if (!texto) {
                        mensaje.textContent =
                            "Escribe un comentario antes de guardar.";
                        comentario.focus();
                        return;
                    }

                    cerrar({
                        calificacion: Number(calificacion.value),
                        comentario: texto
                    });
                } else {
                    cerrar(true);
                }
            });

            if (tipo === "editar") {
                comentario.focus();
            } else {
                cancelar.focus();
            }
        });
    }

    async function enviarFormulario(url, formulario) {
        const respuesta = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formulario.toString()
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.exito) {
            throw new Error(
                resultado.mensaje || "No se pudo completar la operación."
            );
        }

        return resultado;
    }

    async function cargarResenas(destino) {
        const lista = document.getElementById(
            "lista-resenas-" + destino
        );

        const promedioTarjeta = document.querySelector(
            '[data-promedio-destino="' + destino + '"]'
        );

        const valoracionDetalle = document.querySelector(
            '[data-valoracion-detalle="' + destino + '"]'
        );

        if (!promedioTarjeta && !lista && !valoracionDetalle) return;

        try {
            const respuesta = await fetch(
                "../config/obtener_reseñas.php?destino=" +
                encodeURIComponent(destino),
                { credentials: "same-origin" }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok || !datos.exito) {
                throw new Error(datos.mensaje || "Error al cargar reseñas.");
            }

            const promedio = Number(datos.promedio);
            const total = Number(datos.total);

            if (promedioTarjeta) {
    promedioTarjeta.textContent = promedio.toFixed(1);
}

            const estrellasTarjeta = promedioTarjeta
                .closest(".valoracion-destino")
                ?.querySelector(".estrellas-amarillas");

            if (estrellasTarjeta) {
                estrellasTarjeta.style.setProperty(
                    "--porcentaje", (promedio / 5 * 100) + "%"
                );
            }
if (valoracionDetalle) {
    valoracionDetalle.querySelector(".promedio-detalle")
        .textContent = promedio.toFixed(1);

    valoracionDetalle.querySelector(".cantidad-resenas")
        .textContent =
        `(${total} ${total === 1 ? "reseña" : "reseñas"})`;
}

           
if (!lista) return;
lista.replaceChildren();

// Encabezado de la sección de reseñas.
const encabezadoResenas = document.createElement("div");
encabezadoResenas.className = "encabezado-resenas";

const iconoResenas = document.createElement("span");
iconoResenas.className = "icono-encabezado-resenas";
iconoResenas.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ' +
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 ' +
    '8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7 ' +
    'a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3h.5a8.5 8.5 ' +
    '0 0 1 8 8v.5z"/></svg>';

const tituloResenas = document.createElement("h3");
tituloResenas.textContent = "Reseñas de viajeros";

encabezadoResenas.append(iconoResenas, tituloResenas);
lista.appendChild(encabezadoResenas);

if (!datos.resenas.length) {
    lista.appendChild(crearElemento(
        "p",
        "Todavía no hay reseñas para este destino."
    ));
    return;
}


            datos.resenas.forEach(function (resena) {
                const articulo = document.createElement("article");
                articulo.className = "resena";

                articulo.appendChild(crearElemento(
                    "h4", resena.nombre || "Usuario"
                ));

                const fecha = resena.fecha_creacion
                    ? new Date(
                        resena.fecha_creacion.replace(" ", "T")
                    ).toLocaleDateString("es-CO")
                    : "Fecha no disponible";

                articulo.appendChild(crearElemento(
                    "small", "Publicado el " + fecha, "fecha-resena"
                ));

                const nota = Math.min(
                    5, Math.max(0, Number(resena.calificacion) || 0)
                );

                articulo.appendChild(crearElemento(
                    "p",
                    "★".repeat(nota) + "☆".repeat(5 - nota),
                    "estrellas-resena"
                ));

                if (resena.comentario) {
                    articulo.appendChild(crearElemento(
                        "p", resena.comentario
                    ));
                }

                // Solo el propietario puede editar o eliminar su reseña.
                if (
                    Number(datos.id_usuario_sesion) !== 0 &&
                    Number(resena.id_usuario) ===
                    Number(datos.id_usuario_sesion)
                ) {
                    const botones = document.createElement("div");
                    botones.className = "botones-resena";

                    const btnEditar = crearElemento(
                        "button", "Editar", "btn-editar-reseña"
                    );
                    btnEditar.type = "button";

                    btnEditar.addEventListener("click", async function () {
                        const cambios = await crearModal("editar", resena);
                        if (!cambios) return;

                        const formulario = new URLSearchParams();
                        formulario.append("id_resena", resena.id_resena);
                        formulario.append(
                            "calificacion", cambios.calificacion
                        );
                        formulario.append("comentario", cambios.comentario);

                        btnEditar.disabled = true;

                        try {
                            await enviarFormulario(
                                "../config/editar_reseña.php",
                                formulario
                            );
                            await cargarResenas(destino);
                        } catch (error) {
                            console.error(error);
                            alert(error.message);
                        } finally {
                            btnEditar.disabled = false;
                        }
                    });

                    const btnEliminar = crearElemento(
                        "button", "Eliminar", "btn-eliminar-resena"
                    );
                    btnEliminar.type = "button";

                    btnEliminar.addEventListener("click", async function () {
                        const confirmado = await crearModal("eliminar", resena);
                        if (!confirmado) return;

                        const formulario = new URLSearchParams();
                        formulario.append("id_resena", resena.id_resena);

                        btnEliminar.disabled = true;

                        try {
                            await enviarFormulario(
                                "../config/eliminar_reseña.php",
                                formulario
                            );
                            await cargarResenas(destino);
                        } catch (error) {
                            console.error(error);
                            alert(error.message);
                        } finally {
                            btnEliminar.disabled = false;
                        }
                    });

                    botones.append(btnEditar, btnEliminar);
                    articulo.appendChild(botones);
                }

                lista.appendChild(articulo);
            });
        } catch (error) {
            console.error(
                "Error al cargar las reseñas de " + destino, error
            );
           if (lista) {
    lista.replaceChildren(crearElemento(
        "p", "No fue posible cargar las reseñas."
    ));
}
        }
    }

    destinos.forEach(cargarResenas);

    document.querySelectorAll(".form-resena").forEach(function (formulario) {
        formulario.addEventListener("submit", function () {
            setTimeout(function () {
                cargarResenas(formulario.dataset.destino);
            }, 500);
        });
    });
});





/* ===== AMPLIAR IMAGEN DE LA PROGRAMACIÓN ===== */

document.addEventListener("DOMContentLoaded", function () {

    const botonesImagen = document.querySelectorAll(
        ".boton-imagen-programacion"
    );

    botonesImagen.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const rutaImagen = boton.dataset.imagen;
            const textoAlternativo =
                boton.dataset.alt || "Imagen ampliada";

            if (!rutaImagen) return;

            // Crear el fondo de la imagen ampliada.
            const fondo = document.createElement("div");
            fondo.className = "visor-imagen-programacion";

            // Crear la imagen grande.
            const imagen = document.createElement("img");
            imagen.src = rutaImagen;
            imagen.alt = textoAlternativo;

            // Crear el botón para cerrar.
            const cerrar = document.createElement("button");
            cerrar.type = "button";
            cerrar.className = "cerrar-visor-programacion";
            cerrar.textContent = "×";
            cerrar.setAttribute("aria-label", "Cerrar imagen ampliada");

            fondo.append(imagen, cerrar);
            document.body.appendChild(fondo);

            function cerrarVisor() {
                fondo.remove();
                document.removeEventListener("keydown", teclaEscape);
            }

            function teclaEscape(evento) {
                if (evento.key === "Escape") {
                    cerrarVisor();
                }
            }

            cerrar.addEventListener("click", cerrarVisor);

            fondo.addEventListener("click", function (evento) {
                if (evento.target === fondo) {
                    cerrarVisor();
                }
            });

            document.addEventListener("keydown", teclaEscape);
        });
    });
});
