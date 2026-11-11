
// =========================================
// APERTURA Y CIERRE DEL MAPA
// =========================================

const botonAbrirMapa = document.getElementById("abrir-mapa");
const botonCerrarMapa = document.getElementById("cerrar-mapa");
const ventanaMapa = document.getElementById("ventana-mapa");

// Variable para conservar el mapa
let mapa = null;
let mapaPrevia = null;


// =========================================
// INICIALIZAR MAPA LEAFLET
// =========================================

function inicializarMapa() {

    // Evita crear el mapa varias veces
    if (mapa !== null) {
        return;
    }

    // Crear mapa centrado en Nariño
    mapa = L.map("mapa").setView([1.2, -77.3], 6);


    // Agregar cartografía de OpenStreetMap
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

            minZoom: 5,
            maxZoom: 19
        }
    ).addTo(mapa);
    // Capa independiente para los lugares encontrados
    capaLugares = L.layerGroup().addTo(mapa);

}



// =========================================
// INICIALIZAR MAPA DE VISTA PREVIA
// =========================================

function inicializarMapaPrevia() {

    if (mapaPrevia !== null) return;

    mapaPrevia = L.map("mapa-previa", {
        zoomControl: false,
        attributionControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false
    }).setView([1.2, -77.3], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 5,
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapaPrevia);
}


// =========================================
// ABRIR VENTANA DEL MAPA
// =========================================

// Inicializar el mapa de fondo al cargar transporte
inicializarMapaPrevia();

botonAbrirMapa.addEventListener("click", function () {
    ventanaMapa.hidden = false;

    inicializarMapa();

    setTimeout(function () {
        mapa.invalidateSize();
    }, 150);
});


// =========================================
// CERRAR VENTANA DEL MAPA
// =========================================

// =========================================
// LIMPIAR CONSULTA DEL MAPA
// =========================================

function limpiarRecorrido() {

    // Limpiar campos
    campoOrigen.value = "";
    campoDestino.value = "";

    // Limpiar ubicación actual
    ubicacionActual = null;

    // Eliminar marcadores
    if (marcadorOrigen) {
        mapa.removeLayer(marcadorOrigen);
        marcadorOrigen = null;
    }

    if (marcadorDestino) {
        mapa.removeLayer(marcadorDestino);
        marcadorDestino = null;
    }

    // Eliminar rutas
    if (lineaRutaCarro) {
        mapa.removeLayer(lineaRutaCarro);
        lineaRutaCarro = null;
    }

    if (lineaRutaPie) {
        mapa.removeLayer(lineaRutaPie);
        lineaRutaPie = null;
    }

    // Cerrar lista de destinos
    listaDestinos.hidden = true;

    // Restaurar opciones del desplegable
    opcionesDestinos.forEach(function (opcion) {
        opcion.hidden = false;
    });

    // Restaurar mensaje inicial
    informacionRecorrido.innerHTML =
        "<p>Tu distancia y duración estimada aparecerán aquí.</p>";

    // Habilitar botones
    botonBuscar.disabled = false;
    botonUbicacion.disabled = false;

    // Detener lectura de voz
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    // Regresar el mapa a su vista inicial
    if (mapa) {
        mapa.setView([1.2, -77.3], 8);
    }
}


// =========================================
// CERRAR VENTANA DEL MAPA
// =========================================

botonCerrarMapa.addEventListener("click", function () {

    limpiarRecorrido();

    ventanaMapa.hidden = true;

});


// =========================================
// BÚSQUEDA DE ORIGEN Y DESTINO
// =========================================

const formularioRecorrido = document.getElementById("formulario-recorrido");
const campoOrigen = document.getElementById("origen");


campoOrigen.addEventListener("input", function () {

    ubicacionActual = null;

});
const campoDestino = document.getElementById("destino");
const botonBuscar = document.getElementById("buscar-recorrido");
const informacionRecorrido = document.getElementById("informacion-recorrido");

// =========================================
// USAR UBICACIÓN ACTUAL
// =========================================

const botonUbicacion = document.getElementById("usar-ubicacion");

botonUbicacion.addEventListener("click", function () {

    if (!navigator.geolocation) {
        informacionRecorrido.textContent =
            "Tu navegador no permite obtener la ubicación actual.";
        return;
    }

    informacionRecorrido.textContent =
        "Obteniendo tu ubicación actual...";

    botonUbicacion.disabled = true;

    navigator.geolocation.getCurrentPosition(

        async function (posicion) {

            const latitud = posicion.coords.latitude;
            const longitud = posicion.coords.longitude;

            // Nombre que mostraremos si no se encuentra el sector
            let nombreCorto = "Mi ubicación actual";

            try {

                const parametros = new URLSearchParams({
                    lat: latitud,
                    lon: longitud,
                    format: "jsonv2",
                    addressdetails: "1",
                    "accept-language": "es"
                });

                const respuesta = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?${parametros}`
                );

                if (respuesta.ok) {

                    const datos = await respuesta.json();
                    const direccion = datos.address || {};

                    const sector =
                        direccion.neighbourhood ||
                        direccion.suburb ||
                        direccion.quarter ||
                        direccion.residential ||
                        "";

                    const comuna = direccion.city_district || "";

                    const ciudad =
                        direccion.city ||
                        direccion.town ||
                        direccion.village ||
                        direccion.municipality ||
                        "";

                    const departamento = direccion.state || "";

                    nombreCorto = [
                        sector,
                        comuna,
                        ciudad,
                        departamento
                    ].filter((parte, indice, arreglo) =>
                        parte && arreglo.indexOf(parte) === indice
                    ).join(", ") || nombreCorto;

                }

            } catch (error) {

                console.error("No se pudo reconocer el sector:", error);

            }

            ubicacionActual = {
                nombre: "Mi ubicación actual",
                nombreCorto: nombreCorto,
                latitud: latitud,
                longitud: longitud
            };

            campoOrigen.value = "Mi ubicación actual";

            informacionRecorrido.textContent =
                "Ubicación obtenida: " + nombreCorto +
                ". Ahora selecciona tu destino.";

            botonUbicacion.disabled = false;
        },

        function (error) {

            if (error.code === 1) {
                informacionRecorrido.textContent =
                    "Debes permitir el acceso a tu ubicación para continuar.";

            } else if (error.code === 2) {
                informacionRecorrido.textContent =
                    "No fue posible determinar tu ubicación.";

            } else if (error.code === 3) {
                informacionRecorrido.textContent =
                    "La solicitud de ubicación tardó demasiado. Inténtalo nuevamente.";
            }

            botonUbicacion.disabled = false;
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000
        }

    );

});


// =========================================
// DESPLEGABLE DE DESTINOS
// =========================================

const botonAbrirDestinos = document.getElementById("abrir-destinos");
const listaDestinos = document.getElementById("lista-destinos");

const opcionesDestinos = listaDestinos.querySelectorAll("[data-destino]");


// Abrir o cerrar la lista al pulsar la flecha
botonAbrirDestinos.addEventListener("click", function () {

    listaDestinos.hidden = !listaDestinos.hidden;

});


// Seleccionar un destino de la lista
opcionesDestinos.forEach(function (opcion) {

    opcion.addEventListener("click", function () {

        campoDestino.value = opcion.dataset.destino;

        listaDestinos.hidden = true;

    });

});


// Filtrar las opciones mientras se escribe
campoDestino.addEventListener("input", function () {

    const texto = campoDestino.value
        .trim()
        .toLowerCase();

    listaDestinos.hidden = false;

    opcionesDestinos.forEach(function (opcion) {

        const nombre = opcion.dataset.destino.toLowerCase();

        opcion.hidden = !nombre.includes(texto);

    });

});


// Cerrar la lista cuando se hace clic fuera de ella
document.addEventListener("click", function (evento) {

    const clicDentro = listaDestinos.contains(evento.target) ||
        campoDestino.contains(evento.target) ||
        botonAbrirDestinos.contains(evento.target);

    if (!clicDentro) {
        listaDestinos.hidden = true;
    }

});


// Guardar temporalmente las búsquedas para no repetir consultas
const lugaresConsultados = new Map();

// Marcadores del mapa
let marcadorOrigen = null;
let marcadorDestino = null;
let ubicacionActual = null;

// Capa de marcadores del buscador
let capaLugares = null;

// Líneas que representan los recorridos
let lineaRutaCarro = null;
let lineaRutaPie = null;



// Icono personalizado para el origen
const iconoOrigen = L.divIcon({
    className: "contenedor-icono-mapa",
    html: '<div class="pin-mapa pin-origen"><span>O</span></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34]
});

// Icono personalizado para el destino
const iconoDestino = L.divIcon({
    className: "contenedor-icono-mapa",
    html: '<div class="pin-mapa pin-destino"><span>D</span></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -34]
});

function distanciaLevenshtein(a, b) {

    const matriz = Array.from(
        { length: a.length + 1 },
        () => Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) {
        matriz[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        matriz[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {

            const costo = a[i - 1] === b[j - 1] ? 0 : 1;

            matriz[i][j] = Math.min(
                matriz[i - 1][j] + 1,
                matriz[i][j - 1] + 1,
                matriz[i - 1][j - 1] + costo
            );

        }
    }

    return matriz[a.length][b.length];
}

// =========================================
// MUNICIPIOS DE NARIÑO
// =========================================

const municipiosNarino = [
    "Pasto",
    "Ipiales",
    "Tumaco",
    "Sandoná",
    "Túquerres",
    "La Unión",
    "Samaniego",
    "El Tambo",
    "Buesaco",
    "Chachagüí",
    "Consacá",
    "Guachucal",
    "Cumbal",
    "Pupiales",
    "Gualmatán",
    "Yacuanquer",
    "Tangua",
    "La Florida"
];

function normalizarTextoBusqueda(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function corregirLocalidad(texto) {
    const localidad = normalizarTextoBusqueda(texto);

    if (!localidad) {
        return { nombre: "", corregido: false };
    }

    let mejorCoincidencia = "";
    let mejorPuntaje = 0;

    municipiosNarino.forEach(municipio => {
        const nombre = normalizarTextoBusqueda(municipio);

        const distancia = distanciaLevenshtein(localidad, nombre);
        const puntaje = 1 - distancia / Math.max(localidad.length, nombre.length);

        if (puntaje > mejorPuntaje) {
            mejorPuntaje = puntaje;
            mejorCoincidencia = municipio;
        }
    });

    if (mejorPuntaje >= 0.75) {
        return {
            nombre: mejorCoincidencia,
            corregido: localidad !== normalizarTextoBusqueda(mejorCoincidencia)
        };
    }

    return { nombre: texto, corregido: false };
}


async function buscarLugar(nombre) {

    // Normalizar el texto escrito
    function normalizarNombre(texto) {
        return texto.trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[-–—]/g, " ")
            .replace(/\s+/g, " ");
    }

    const nombreNormalizado = normalizarNombre(nombre);


    // =========================================
    // RECONOCIMIENTO APROXIMADO DE DESTINOS
    // =========================================

    // Quitar artículos iniciales y espacios
    const nombreComparar = nombreNormalizado
        .replace(/^(las|los|la|el)\s+/, "")
        .replace(/\s+/g, "");

    // Buscar la coincidencia más parecida
    let mejorCoincidencia = null;
    let mejorPuntaje = 0;

    Object.keys(destinosWayra).forEach(function (clave) {

        const nombreCatalogo = normalizarNombre(clave)
            .replace(/^(las|los|la|el)\s+/, "")
            .replace(/\s+/g, "");

        const distancia = distanciaLevenshtein(
            nombreComparar,
            nombreCatalogo
        );

        const longitudMayor = Math.max(
            nombreComparar.length,
            nombreCatalogo.length
        );

        const similitud = longitudMayor === 0
            ? 1
            : 1 - distancia / longitudMayor;

        if (similitud > mejorPuntaje) {
            mejorPuntaje = similitud;
            mejorCoincidencia = clave;
        }

    });

    // Aceptar coincidencias suficientemente parecidas
    const nombreDestino = mejorPuntaje >= 0.82
        ? mejorCoincidencia
        : null;

    // Si existe en Wayra, usar sus coordenadas
    if (nombreDestino) {

        const destinoWayra = destinosWayra[nombreDestino];

        return {
            nombre: nombreDestino,
            latitud: destinoWayra.lat,
            longitud: destinoWayra.lng
        };
    }

    // Si no pertenece al catálogo, buscarlo en Nominatim
    const consulta = nombre.trim() + ", Nariño, Colombia";

    if (lugaresConsultados.has(consulta.toLowerCase())) {
        return lugaresConsultados.get(consulta.toLowerCase());
    }

    const parametros = new URLSearchParams({
        q: consulta,
        format: "jsonv2",
        limit: "1",
        addressdetails: "1",
        "accept-language": "es"
    });

    const respuesta = await fetch(
        `https://nominatim.openstreetmap.org/search?${parametros}`
    );

    if (!respuesta.ok) {
        throw new Error("No fue posible consultar el servicio de búsqueda.");
    }

    const resultados = await respuesta.json();

    if (resultados.length === 0) {
        return null;
    }
    const lugar = {
        nombre: resultados[0].display_name,
        direccion: resultados[0].address || {},
        latitud: Number(resultados[0].lat),
        longitud: Number(resultados[0].lon)
    };
    lugaresConsultados.set(consulta.toLowerCase(), lugar);

    return lugar;
}
// =========================================
// NOMBRE CORTO DE LOS LUGARES
// =========================================

function obtenerNombreCorto(lugar) {

    if (lugar.nombreCorto) {
        return lugar.nombreCorto;
    }

    if (!lugar.direccion) {
        return lugar.nombre;
    }

    const direccion = lugar.direccion;

    const sector =
        direccion.neighbourhood ||
        direccion.suburb ||
        direccion.quarter ||
        direccion.residential ||
        "";

    const comuna = direccion.city_district || "";

    const ciudad =
        direccion.city ||
        direccion.town ||
        direccion.village ||
        direccion.municipality ||
        "";

    const departamento = direccion.state || "";

    const partes = [
        sector,
        comuna,
        ciudad,
        departamento
    ].filter((parte, indice, arreglo) =>
        parte && arreglo.indexOf(parte) === indice
    );

    return partes.length > 0
        ? partes.join(", ")
        : lugar.nombre;
}

// =========================================
// ESPERA ENTRE CONSULTAS
// =========================================

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================================
// CALCULAR RUTA CON VALHALLA
// =========================================


async function calcularRutaValhalla(lugarOrigen, lugarDestino, modalidad) {

    const respuesta = await fetch(
        "https://valhalla1.openstreetmap.de/route",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": "wayra-kawsay-academic-project"
            },

            body: JSON.stringify({
                locations: [
                    {
                        lat: lugarOrigen.latitud,
                        lon: lugarOrigen.longitud
                    },
                    {
                        lat: lugarDestino.latitud,
                        lon: lugarDestino.longitud
                    }
                ],

                costing: modalidad,
                units: "km",
                language: "es-ES",
                format: "osrm",
                shape_format: "geojson"
            })
        }
    );

    const textoRespuesta = await respuesta.text();

    let datos;

    try {
        datos = JSON.parse(textoRespuesta);
    } catch (error) {
        datos = {};
    }

    // Mostrar la respuesta del servicio en consola
    console.log("Respuesta de Valhalla (" + modalidad + "):", {
        estado: respuesta.status,
        datos: datos,
        respuestaOriginal: textoRespuesta
    });

    if (!respuesta.ok) {

        if (datos.code === "DistanceExceeded") {
            throw new Error(
                "DISTANCIA_EXCEDIDA: El recorrido a pie es demasiado largo para calcularlo."
            );
        }

        throw new Error(
            datos.error ||
            datos.status_message ||
            datos.message ||
            "Error HTTP " + respuesta.status + " de Valhalla."
        );
    }

    if (!datos.routes || !datos.routes.length) {
        throw new Error(
            datos.error ||
            datos.status_message ||
            "Valhalla no encontró una ruta para esta modalidad."
        );
    }

    return datos.routes[0];
}


// =========================================
// LEER INFORMACIÓN DE LOS MARCADORES
// =========================================

function hablarLugar(texto) {

    // Comprobar si el navegador permite reproducir voz
    if (!("speechSynthesis" in window)) {
        console.warn("Este navegador no permite reproducir voz.");
        return;
    }

    // Detener cualquier lectura anterior
    window.speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);

    // Configurar la voz en español
    mensaje.lang = "es-CO";
    mensaje.rate = 0.95;
    mensaje.pitch = 1;

    window.speechSynthesis.speak(mensaje);
}




function formatearDuracion(segundos) {

    const minutosTotales = Math.round(segundos / 60);

    if (minutosTotales >= 60) {

        const horas = Math.floor(minutosTotales / 60);
        const minutos = minutosTotales % 60;

        return horas + " h " + minutos + " min";

    }

    return minutosTotales + " min";
}

// =========================================
// PROCESAR EL FORMULARIO
// =========================================

formularioRecorrido.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const origen = campoOrigen.value.trim();
    const destino = campoDestino.value.trim();

    if (!origen || !destino) {
        informacionRecorrido.textContent =
            "Escribe un origen y un destino para continuar.";
        return;
    }

    botonBuscar.disabled = true;

    informacionRecorrido.textContent = "Buscando los lugares...";

    try {

        // =========================================
        // BUSCAR ORIGEN Y DESTINO
        // =========================================

        const lugarOrigen =
            ubicacionActual && origen === "Mi ubicación actual"
                ? ubicacionActual
                : await buscarLugar(origen);

        if (!lugarOrigen) {
            informacionRecorrido.textContent =
                "No encontramos el lugar de origen. Revisa el nombre.";
            return;
        }

        await esperar(1100);

        const lugarDestino = await buscarLugar(destino);

        if (!lugarDestino) {
            informacionRecorrido.textContent =
                "No encontramos el destino. Revisa el nombre.";
            return;
        }


        // =========================================
        // ELIMINAR ELEMENTOS ANTERIORES
        // =========================================

        if (marcadorOrigen) {
            mapa.removeLayer(marcadorOrigen);
        }

        if (marcadorDestino) {
            mapa.removeLayer(marcadorDestino);
        }

        if (lineaRutaCarro) {
            mapa.removeLayer(lineaRutaCarro);
        }

        if (lineaRutaPie) {
            mapa.removeLayer(lineaRutaPie);
        }


        // =========================================
        // COLOCAR MARCADORES
        // =========================================

        marcadorOrigen = L.marker(
            [lugarOrigen.latitud, lugarOrigen.longitud],
            { icon: iconoOrigen }
        ).addTo(mapa);

        marcadorOrigen.bindPopup(
            "Punto de partida: " + obtenerNombreCorto(lugarOrigen)

        );


        // Leer el punto de partida al seleccionar el marcador
        marcadorOrigen.on("click", function () {

            hablarLugar(
                "Punto de partida: " + obtenerNombreCorto(lugarOrigen)
            );

        });



        marcadorDestino = L.marker(
            [lugarDestino.latitud, lugarDestino.longitud],
            { icon: iconoDestino }
        ).addTo(mapa);

        marcadorDestino.bindPopup(
            "Destino: " + obtenerNombreCorto(lugarDestino)
        );



        // Leer el destino al seleccionar el marcador
        marcadorDestino.on("click", function () {

            hablarLugar(
                "Destino: " + obtenerNombreCorto(lugarDestino)
            );

        });


        // =========================================
        // CALCULAR LAS DOS MODALIDADES
        // =========================================

        informacionRecorrido.textContent =
            "Calculando recorridos en carro y a pie...";

        const resultados = await Promise.allSettled([

            calcularRutaValhalla(
                lugarOrigen,
                lugarDestino,
                "auto"
            ),

            calcularRutaValhalla(
                lugarOrigen,
                lugarDestino,
                "pedestrian"
            )

        ]);

        const resultadoCarro = resultados[0];
        const resultadoPie = resultados[1];


        // =========================================
        // REVISAR ERRORES DE LAS MODALIDADES
        // =========================================

        if (resultadoCarro.status === "rejected") {
            console.error("ERROR EN CARRO:", resultadoCarro.reason);
        }

        if (resultadoPie.status === "rejected") {
            console.error("ERROR A PIE:", resultadoPie.reason);
        }

        const rutaCarro =
            resultadoCarro.status === "fulfilled"
                ? resultadoCarro.value
                : null;




        // Comprobar dónde termina la ruta en carro
        if (rutaCarro) {

            const coordenadasFinales =
                rutaCarro.geometry.coordinates[
                rutaCarro.geometry.coordinates.length - 1
                ];

            console.log("Destino solicitado:", {
                latitud: lugarDestino.latitud,
                longitud: lugarDestino.longitud
            });

            console.log("Final de la ruta en carro:", {
                longitud: coordenadasFinales[0],
                latitud: coordenadasFinales[1]
            });

        }

        const rutaPie =
            resultadoPie.status === "fulfilled"
                ? resultadoPie.value
                : null;


        // =========================================
        // DIBUJAR RECORRIDO EN CARRO
        // =========================================

        if (rutaCarro) {

            lineaRutaCarro = L.geoJSON(rutaCarro.geometry, {
                style: {
                    color: "#174C3C",
                    weight: 6,
                    opacity: 0.9
                }
            });

            // Identificar la línea como recorrido en carro
            lineaRutaCarro.eachLayer(function (capa) {

                capa.bindTooltip("🚗 Recorrido en carro", {
                    sticky: true,
                    direction: "top"
                });

                // Resaltar la línea al pasar el cursor
                capa.on("mouseover", function (evento) {
                    evento.target.setStyle({
                        weight: 9,
                        opacity: 1
                    });
                });

                // Recuperar el grosor original
                capa.on("mouseout", function (evento) {
                    evento.target.setStyle({
                        weight: 6,
                        opacity: 0.9
                    });
                });

                // Mostrar el nombre también al hacer clic
                capa.on("click", function (evento) {
                    capa.openTooltip(evento.latlng);
                });

            });

            lineaRutaCarro.addTo(mapa);

        }


        // =========================================
        // DIBUJAR RECORRIDO A PIE
        // =========================================

        if (rutaPie) {

            lineaRutaPie = L.geoJSON(rutaPie.geometry, {
                style: {
                    color: "#3985A8",
                    weight: 5,
                    opacity: 0.9,
                    dashArray: "8 7"
                }
            });

            // Identificar la línea como recorrido a pie
            lineaRutaPie.eachLayer(function (capa) {

                capa.bindTooltip("🚶 Recorrido a pie", {
                    sticky: true,
                    direction: "top"
                });

                // Resaltar la línea al pasar el cursor
                capa.on("mouseover", function (evento) {
                    evento.target.setStyle({
                        weight: 8,
                        opacity: 1
                    });
                });

                // Recuperar el grosor original
                capa.on("mouseout", function (evento) {
                    evento.target.setStyle({
                        weight: 5,
                        opacity: 0.9
                    });
                });

                // Mostrar el nombre también al hacer clic
                capa.on("click", function (evento) {
                    capa.openTooltip(evento.latlng);
                });

            });

            lineaRutaPie.addTo(mapa);

        }


        // =========================================
        // AJUSTAR EL MAPA A LOS RECORRIDOS
        // =========================================

        const capasRuta = [
            lineaRutaCarro,
            lineaRutaPie
        ].filter(Boolean);

        if (capasRuta.length === 0) {
            throw new Error("No fue posible calcular ninguna modalidad.");
        }

        const grupoRutas = L.featureGroup(capasRuta);

        mapa.fitBounds(grupoRutas.getBounds(), {
            padding: [50, 50]
        });


        // =========================================
        // MOSTRAR RESULTADOS
        // =========================================

        informacionRecorrido.innerHTML = `
            <div class="resultados-modalidades">

                <div class="datos-lugares">
                    <p><strong>Punto de partida</strong></p>
                    <p class="nombre-origen"></p>

                    <p><strong>Destino</strong></p>
                    <p class="nombre-destino"></p>
                </div>

                <h3>Resultados del recorrido</h3>

                <article class="tarjeta-modalidad">

                    <h4>🚗 En carro</h4>

                    <div class="datos-modalidad">
                        <div>
                            <span>Distancia</span>
                            <strong class="distancia-carro"></strong>
                        </div>

                        <div>
                            <span>Duración estimada</span>
                            <strong class="duracion-carro"></strong>
                        </div>
                    </div>

                </article>

                <article class="tarjeta-modalidad">

                    <h4>🚶 A pie</h4>

                    <div class="datos-modalidad">
                        <div>
                            <span>Distancia</span>
                            <strong class="distancia-pie"></strong>
                        </div>

                        <div>
                            <span>Duración estimada</span>
                            <strong class="duracion-pie"></strong>
                        </div>
                    </div>

                </article>

                <p class="aviso-tiempo">
                    Los tiempos son estimados y pueden variar según las
                    condiciones del recorrido.
                </p>

           <p class="aviso-acceso">
    El acceso vehicular puede llegar solamente hasta un punto
    cercano al destino. Consulta las condiciones de ingreso
    antes de visitar el lugar.
</p>

            </div>
        `;


        // Colocar los nombres sin insertar texto externo como HTML
        informacionRecorrido.querySelector(".nombre-origen").textContent =
            obtenerNombreCorto(lugarOrigen);

        informacionRecorrido.querySelector(".nombre-destino").textContent =
            obtenerNombreCorto(lugarDestino);


        // Mostrar resultado en carro
        if (rutaCarro) {

            informacionRecorrido.querySelector(".distancia-carro").textContent =
                (rutaCarro.distance / 1000).toFixed(1) + " km";

            informacionRecorrido.querySelector(".duracion-carro").textContent =
                formatearDuracion(rutaCarro.duration);

        } else {

            informacionRecorrido.querySelector(".distancia-carro").textContent =
                "No disponible";

            informacionRecorrido.querySelector(".duracion-carro").textContent =
                "No disponible";
        }


        // Mostrar resultado a pie
        // Mostrar resultado a pie
        if (rutaPie) {

            informacionRecorrido.querySelector(".distancia-pie").textContent =
                (rutaPie.distance / 1000).toFixed(1) + " km";

            informacionRecorrido.querySelector(".duracion-pie").textContent =
                formatearDuracion(rutaPie.duration);

        } else if (
            resultadoPie.reason &&
            resultadoPie.reason.message.includes("DISTANCIA_EXCEDIDA")
        ) {

            informacionRecorrido.querySelector(".distancia-pie").textContent =
                "Trayecto demasiado largo";

            informacionRecorrido.querySelector(".duracion-pie").textContent =
                "No calculable a pie";

        } else {

            informacionRecorrido.querySelector(".distancia-pie").textContent =
                "No disponible";

            informacionRecorrido.querySelector(".duracion-pie").textContent =
                "No disponible";
        }


    } catch (error) {

        console.error("Error al calcular los recorridos:", error);

        informacionRecorrido.textContent =
            "No fue posible calcular los recorridos. Inténtalo nuevamente.";

    } finally {

        botonBuscar.disabled = false;

    }

});

// =========================================
// DESTINOS TURÍSTICOS DE WAYRA KAWSAY
// =========================================

const destinosWayra = {
    "Laguna de La Cocha": {
        lat: 1.0928651,
        lng: -77.1542684
    },

    "Santuario de Las Lajas": {
        lat: 0.8054536,
        lng: -77.5858583
    },

    "Volcán Galeras": {
        lat: 1.2218796,
        lng: -77.3694901
    },




    "Playas de Tumaco - El Morro": {
        lat: 1.8301252,
        lng: -78.7348378
    },

    "Museo del Oro": {
        lat: 1.2115169,
        lng: -77.2765973
    },

    "Gradas de Belén": {
        lat: 1.2840904,
        lng: -77.4663843
    },

    "Laguna de la Cruz - Tajumbina": {
        lat: 1.575066,
        lng: -76.9337697
    },

    "Katza-pi": {
        lat: 1.2068914,
        lng: -77.9879304
    }
};



// =========================================
// BUSCADOR DE LUGARES DE INTERÉS EN NARIÑO
// =========================================

const campoBuscarLugares = document.getElementById("buscar-lugares");
const botonBuscarLugares = document.getElementById("btn-buscar-lugares");
const resultadosLugares = document.getElementById("resultados-lugares");

let marcadoresEncontrados = [];

// Categorías que puede reconocer el buscador
// Categorías que puede reconocer el buscador
// color y glifo definen el icono del mapa (estilo pin de Google Maps)
const categoriasLugares = [
    {
        palabras: /iglesias?|capillas?|templos?|iglesia?/i,
        nombre: "Iglesias",
        tipo: "Iglesia",
        emoji: "⛪",
        color: "#5D4037",
        glifo: "M18 12.22V9l-5-2.5V5h2V3h-2V1h-2v2H9v2h2v1.5L6 9v3.22L2 14v8h8v-3c0-1.1.9-2 2-2s2 .9 2 2v3h8v-8l-4-1.78zM12 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
        filtro: '["amenity"="place_of_worship"]'
    },
    {
        palabras: /supermercados?|mercados?/i,
        nombre: "Supermercados",
        tipo: "Supermercado",
        emoji: "🛒",
        color: "#0288D1",
        glifo: "M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z",
        filtro: '["shop"="supermarket"]'
    },
    {
        palabras: /restaurantes?|comida/i,
        nombre: "Restaurantes",
        tipo: "Restaurante",
        emoji: "🍽️",
        color: "#EF6C00",
        glifo: "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
        filtro: '["amenity"="restaurant"]'
    },
    {
        palabras: /hospitales?/i,
        nombre: "Hospitales",
        tipo: "Hospital",
        emoji: "🏥",
        color: "#D32F2F",
        glifo: "M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z",
        filtro: '["amenity"="hospital"]'
    },
    {
        palabras: /farmacias?|droguer[ií]as?/i,
        nombre: "Farmacias",
        tipo: "Farmacia",
        emoji: "💊",
        color: "#2E7D32",
        glifo: "M21 5h-2.64l1.14-3.14L17.15 1l-1.46 4H3v2l2 6-2 6v2h18v-2l-2-6 2-6V5zm-5 9h-3v3h-2v-3H8v-2h3V9h2v3h3v2z",
        filtro: '["amenity"="pharmacy"]'
    },
    {
        palabras: /hoteles?|alojamientos?|hotel?/i,
        nombre: "Hoteles",
        tipo: "Hotel",
        emoji: "🏨",
        color: "#8E24AA",
        glifo: "M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z",
        filtro: '["tourism"="hotel"]'
    },
    {
        palabras: /museos?|museo?/i,
        nombre: "Museos",
        tipo: "Museo",
        emoji: "🏛️",
        color: "#AD1457",
        glifo: "M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z",
        filtro: '["tourism"="museum"]'
    },
    {
        palabras: /parques?/i,
        nombre: "Parques",
        tipo: "Parque",
        emoji: "🌳",
        color: "#7CB342",
        glifo: "M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.96v-4H21l-4-6z",
        filtro: '["leisure"="park"]'
    },
    {
        palabras: /cafeter[ií]as?|caf[eé]s?/i,
        nombre: "Cafeterias",
        tipo: "Cafetería",
        emoji: "☕",
        color: "#A0522D",
        glifo: "M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.9 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z",
        filtro: '["amenity"="cafe"]'
    },
    {
        palabras: /gasolineras?|estaciones de servicio/i,
        nombre: "Gasolineras",
        tipo: "Gasolinera",
        emoji: "⛽",
        color: "#546E7A",
        glifo: "M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
        filtro: '["amenity"="fuel"]'
    },
    {
        palabras: /bancos?/i,
        nombre: "Bancos",
        tipo: "Banco",
        emoji: "🏦",
        color: "#283593",
        glifo: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
        filtro: '["amenity"="bank"]'
    },
    {
        palabras: /colegios?|escuelas?|instituci[oó]n(?:es)? educativas?/i,
        nombre: "Colegios",
        tipo: "Colegio",
        emoji: "🎓",
        color: "#00ACC1",
        glifo: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
        filtro: '["amenity"="school"]'
    }
];


// Limpiar resultados anteriores
function limpiarBuscadorLugares() {

    if (capaLugares) {
        capaLugares.clearLayers();
    }

    marcadoresEncontrados = [];

    resultadosLugares.innerHTML = "";
    campoBuscarLugares.value = "";
}


// Crear un marcador según la categoría
// Icono de pin estilo Google Maps: gota de color con un símbolo blanco
function crearIconoLugar(categoria) {

    const color = categoria ? categoria.color : "#174C3C";

    // Círculo simple cuando la búsqueda no tiene categoría
    const glifo = categoria
        ? categoria.glifo
        : "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z";

    return L.divIcon({
        className: "icono-pin-lugar",
        html:
            '<svg viewBox="-1 -1 32 42" width="24" height="32" ' +
            'style="display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">' +
            '<path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.7 23.3 0 15 0z" ' +
            'fill="' + color + '" stroke="#fff" stroke-width="2"/>' +
            '<g transform="translate(5.5 5.5) scale(0.82)" fill="#fff">' +
            '<path d="' + glifo + '"/></g></svg>',
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -30]
    });
}


// Seleccionar un lugar como destino
function seleccionarLugar(lugar) {

    campoDestino.value = lugar.nombre +
        (lugar.localidad ? ", " + lugar.localidad : ", Nariño");

    listaDestinos.hidden = true;

    mapa.setView(
        [lugar.latitud, lugar.longitud],
        16
    );

    if (lugar.marcador) {
        lugar.marcador.openPopup();
    }

}


// Crear la tarjeta de cada resultado
function crearResultadoLugar(lugar) {

    const tarjeta = document.createElement("div");
    tarjeta.className = "resultado-lugar-item";

    const titulo = document.createElement("strong");
    titulo.textContent = lugar.emoji + " " + lugar.nombre;

    const ubicacion = document.createElement("p");
    ubicacion.textContent = lugar.localidad || "Nariño, Colombia";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Usar como destino";

    boton.addEventListener("click", function () {
        seleccionarLugar(lugar);
    });

    tarjeta.appendChild(titulo);
    tarjeta.appendChild(ubicacion);
    tarjeta.appendChild(boton);

    resultadosLugares.appendChild(tarjeta);

}


// Buscar lugares mediante Overpass API
// =========================================
// CONSULTA DE LUGARES
// Principal: Nominatim. Respaldo: Overpass.
// (Ninguno tiene relación con las teselas del mapa)
// =========================================

// Servidores Overpass, usados solo si Nominatim falla
const servidoresOverpass = [
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.private.coffee/api/interpreter"
];

const TIEMPO_LIMITE_SERVIDOR_MS = 12000;

// Prueba los servidores Overpass en orden hasta que uno responda bien
async function consultarOverpass(consulta, alCambiarServidor) {

    const errores = [];

    for (let i = 0; i < servidoresOverpass.length; i++) {

        const url = servidoresOverpass[i];

        if (alCambiarServidor) {
            alCambiarServidor(i + 1, servidoresOverpass.length);
        }

        const controlador = new AbortController();
        const temporizador = setTimeout(function () {
            controlador.abort();
        }, TIEMPO_LIMITE_SERVIDOR_MS);

        try {

            const respuesta = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                },
                body: new URLSearchParams({ data: consulta }).toString(),
                signal: controlador.signal
            });

            const textoRespuesta = await respuesta.text();

            console.log("Overpass", url, "estado:", respuesta.status);

            if (!respuesta.ok) {
                throw new Error("HTTP " + respuesta.status);
            }

            let datos;

            try {
                datos = JSON.parse(textoRespuesta);
            } catch {
                throw new Error("la respuesta no es JSON válido");
            }

            if (datos.remark) {
                throw new Error(datos.remark);
            }

            if (!Array.isArray(datos.elements)) {
                throw new Error("la respuesta no contiene una lista de lugares");
            }

            return datos;

        } catch (error) {

            const motivo = error.name === "AbortError"
                ? "no respondió en " + (TIEMPO_LIMITE_SERVIDOR_MS / 1000) + " s"
                : error.message;

            console.warn("Overpass falló en", url, "→", motivo);
            errores.push(url + " → " + motivo);

        } finally {
            clearTimeout(temporizador);
        }
    }

    console.error("Todos los servidores Overpass fallaron:", errores);

    throw new Error(
        "Los servicios de lugares de interés no respondieron. " +
        "Inténtalo de nuevo en unos minutos."
    );
}


// Busca lugares con Nominatim y los devuelve en formato Overpass (elements)
async function consultarNominatimLugares(categoria, busqueda, lat, lon) {

    // Recuadro de aprox. 5 km alrededor del centro
    const delta = 0.045;
    const caja = [lon - delta, lat + delta, lon + delta, lat - delta].join(",");

    let textoConsulta;
    let claveOsm = "";
    let valorOsm = "";

    if (categoria) {

        // Del filtro ["amenity"="restaurant"] se toma amenity y restaurant
        const partes = categoria.filtro.match(/\["([^"]+)"="([^"]+)"\]/);

        claveOsm = partes ? partes[1] : "";
        valorOsm = partes ? partes[2] : "";

        textoConsulta = "[" + valorOsm.replace(/_/g, " ") + "]";

    } else {

        textoConsulta = busqueda;
    }

    const parametros = new URLSearchParams({
        q: textoConsulta,
        format: "jsonv2",
        limit: "40",
        viewbox: caja,
        bounded: "1",
            extratags: "1",
        addressdetails: "1",
        "accept-language": "es"
    });

    const controlador = new AbortController();
    const temporizador = setTimeout(function () {
        controlador.abort();
    }, 15000);

    try {

        const respuesta = await fetch(
            "https://nominatim.openstreetmap.org/search?" + parametros,
            { signal: controlador.signal }
        );

        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        let resultados = await respuesta.json();

        if (!Array.isArray(resultados)) {
            throw new Error("respuesta inesperada de Nominatim");
        }

        // Con categoría, conservar solo lo que es realmente de ese tipo
        // (descarta, por ejemplo, divisiones administrativas)
        const respuestaTraeTipo = resultados.some(function (r) {
            return r.category !== undefined;
        });

        if (categoria && claveOsm && respuestaTraeTipo) {
            resultados = resultados.filter(function (r) {
                return r.category === claveOsm && r.type === valorOsm;
            });
        }

        // Quitar duplicados (mismo nombre y misma ubicación aproximada)
        const vistos = new Set();
        const elements = [];

        resultados.forEach(function (r) {

            const nombre = r.name || r.display_name.split(",")[0];

            const clave = nombre.toLowerCase() + "|" +
                Number(r.lat).toFixed(3) + "|" +
                Number(r.lon).toFixed(3);

            if (vistos.has(clave)) {
                return;
            }

            vistos.add(clave);

            const dir = r.address || {};

            elements.push({
                lat: Number(r.lat),
                lon: Number(r.lon),
                tags: {
    name: nombre,
    "addr:street": dir.road || "",
    "addr:housenumber": dir.house_number || "",
    "addr:suburb": dir.suburb || dir.neighbourhood || "",
    "addr:city":
        dir.city || dir.town || dir.village || dir.municipality || "",
    phone: r.extratags?.phone || "",
    opening_hours: r.extratags?.opening_hours || "",
    website: r.extratags?.website || ""
}
            });
        });

        return { elements: elements.slice(0, 30) };

    } catch (error) {

        console.warn("Nominatim (lugares) falló:", error);

        throw new Error(
            "No fue posible consultar los lugares en este momento. " +
            "Inténtalo de nuevo en unos minutos."
        );

    } finally {
        clearTimeout(temporizador);
    }
}


// Buscar lugares de interés
async function buscarLugaresInteres() {

    const texto = campoBuscarLugares.value.trim();

    if (!texto) {
        resultadosLugares.textContent =
            "Escribe qué tipo de lugar deseas encontrar.";
        return;
    }

    limpiarResultadosAnteriores();

    botonBuscarLugares.disabled = true;

    // Indicador de tiempo transcurrido (no hay progreso real que medir)
    let nombreBusqueda = "lugares";
let detalleBusqueda = "";

function mostrarTiempoBusqueda() {
    resultadosLugares.innerHTML = `
        <div class="estado-busqueda">
            <span>${nombreBusqueda}${detalleBusqueda}</span>
            <div class="barra-carga">
                <div class="barra-carga-progreso"></div>
            </div>
        </div>
    `;
}

mostrarTiempoBusqueda();
const temporizadorTiempo = null;

    try {

        // Reconocer la categoría y la localidad
        // Detectar la categoría sin importar su posición
const categoria = categoriasLugares.find(item =>
    item.palabras.test(texto)
);

// Extraer el municipio o localidad
let localidad = categoria
    ? texto.replace(categoria.palabras, "").trim()
    : "";

// Quitar conectores como "en" o "de"
localidad = localidad
    .replace(/\b(en|de)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

// Corregir posibles errores de escritura
const resultadoCorreccion = corregirLocalidad(localidad);

localidad = resultadoCorreccion.nombre;

// Evitar interpretar búsquedas generales como municipios
if (/^(general|nariño|narino)$/i.test(localidad)) {
    localidad = "";
}

// Texto restante de la búsqueda
const busqueda = localidad || texto;

        // Construir el filtro según la categoría o el nombre buscado
        let filtro = "";

        if (categoria) {

            filtro = categoria.filtro;

        } else {

            const busquedaSegura = busqueda
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filtro = `["name"~"${busquedaSegura}",i]`;

        }

        // Obtener la localidad.
        // Si no se especifica, buscar en Pasto.
        detalleBusqueda = " · ubicando la localidad";

        const lugarReferencia = await buscarLugar(localidad || "Pasto");

        if (!lugarReferencia) {
            throw new Error("No encontramos la localidad indicada.");
        }

        // Obtener las coordenadas de esa localidad
        const latCentro = lugarReferencia.latitud;
        const lonCentro = lugarReferencia.longitud;

        // Consulta de respaldo para Overpass
        let consulta = `
            [out:json][timeout:10];

            nwr(around:5000,${latCentro},${lonCentro})${filtro};

            out center tags 30;
        `;

        let datos;

        try {

            detalleBusqueda = " · consultando lugares";

            // Nominatim pide máximo 1 consulta por segundo
            await esperar(1100);

            datos = await consultarNominatimLugares(
                categoria,
                busqueda,
                latCentro,
                lonCentro
            );

        } catch (errorNominatim) {

            console.warn(
                "Nominatim no respondió, probando Overpass:",
                errorNominatim.message
            );

            datos = await consultarOverpass(consulta, function (numero, total) {
                detalleBusqueda = " · servicio alterno " + numero + " de " + total;
            });
        }

        // Detener el contador antes de mostrar los resultados
        clearInterval(temporizadorTiempo);

        if (!datos.elements || datos.elements.length === 0) {
            resultadosLugares.textContent =
                "No encontramos lugares con esa búsqueda. Intenta con otra categoría o localidad.";
            return;
        }

        const lugares = datos.elements;

        let cantidad = 0;

        lugares.forEach(function (elemento) {

            const latitud = elemento.lat ?? elemento.center?.lat;
            const longitud = elemento.lon ?? elemento.center?.lon;

            if (latitud === undefined || longitud === undefined) {
                return;
            }

            const etiquetas = elemento.tags || {};

            const nombre = etiquetas.name ||
                (categoria ? categoria.nombre : "Lugar encontrado");

            const ciudad =
                etiquetas["addr:city"] ||
                etiquetas["addr:town"] ||
                etiquetas["addr:village"] ||
                etiquetas["addr:municipality"] ||
                localidad ||
                "Nariño, Colombia";

            const lugar = {
                nombre: nombre,
                localidad: ciudad,
                latitud: Number(latitud),
                longitud: Number(longitud),
                emoji: emoji,
                marcador: null
            };

            // Agregar marcador independiente
            const marcador = L.marker(
                [lugar.latitud, lugar.longitud],
                { icon: crearIconoLugar(categoria) }
            ).addTo(capaLugares);

            lugar.marcador = marcador;

            
            // Información emergente del marcador
const contenido = document.createElement("div");
contenido.className = "popup-lugar";

const tituloPopup = document.createElement("strong");
tituloPopup.textContent = emoji + " " + nombre;
contenido.appendChild(tituloPopup);

const direccion = [
    etiquetas["addr:street"],
    etiquetas["addr:housenumber"],
    etiquetas["addr:suburb"],
    ciudad
].filter(Boolean).join(", ");

if (direccion) {
    const direccionPopup = document.createElement("p");
    direccionPopup.textContent = "📍 " + direccion;
    contenido.appendChild(direccionPopup);
}

if (etiquetas.phone) {
    const telefonoPopup = document.createElement("p");
    telefonoPopup.textContent = "☎️ " + etiquetas.phone;
    contenido.appendChild(telefonoPopup);
}

if (etiquetas.opening_hours) {
    const horarioPopup = document.createElement("p");
    horarioPopup.textContent = "🕒 " + etiquetas.opening_hours;
    contenido.appendChild(horarioPopup);
}

if (etiquetas.website) {
    const webPopup = document.createElement("a");
    webPopup.href = etiquetas.website;
    webPopup.target = "_blank";
    webPopup.rel = "noopener noreferrer";
    webPopup.textContent = "🌐 Visitar sitio web";
    contenido.appendChild(webPopup);
}

const botonPopup = document.createElement("button");
botonPopup.type = "button";
botonPopup.textContent = "Usar como destino";

botonPopup.addEventListener("click", function () {
    seleccionarLugar(lugar);
});

contenido.appendChild(botonPopup);

marcador.bindPopup(contenido);

            marcadoresEncontrados.push(marcador);

         

            cantidad++;

        });

        if (cantidad === 0) {
            resultadosLugares.textContent =
                "No encontramos lugares con coordenadas disponibles.";
            return;
        }

        // Mostrar todos los resultados encontrados
        const grupo = L.featureGroup(marcadoresEncontrados);

        mapa.fitBounds(grupo.getBounds(), {
            padding: [35, 35],
            maxZoom: 14
        });

    } catch (error) {

        console.error("Error al buscar lugares:", error);

        if (error.name === "AbortError") {

            resultadosLugares.textContent =
                "La búsqueda tardó demasiado. Inténtalo nuevamente.";

        } else {

            resultadosLugares.textContent =
                "Error en la búsqueda: " + error.message;

        }

    } finally {

        clearInterval(temporizadorTiempo);
        botonBuscarLugares.disabled = false;

    }

}


// Limpiar resultados sin borrar el texto de búsqueda
function limpiarResultadosAnteriores() {

    if (capaLugares) {
        capaLugares.clearLayers();
    }

    marcadoresEncontrados = [];
    resultadosLugares.innerHTML = "";

}


// Activar búsqueda con el botón
botonBuscarLugares.addEventListener(
    "click",
    buscarLugaresInteres
);


// Permitir buscar pulsando Enter
campoBuscarLugares.addEventListener("keydown", function (evento) {

    if (evento.key === "Enter") {
        evento.preventDefault();
        buscarLugaresInteres();
    }

});


// Limpiar el buscador al cerrar el mapa
botonCerrarMapa.addEventListener(
    "click",
    limpiarBuscadorLugares
);
