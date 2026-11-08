
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