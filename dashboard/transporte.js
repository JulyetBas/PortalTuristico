
// =========================================
// APERTURA Y CIERRE DEL MAPA
// =========================================

const botonAbrirMapa = document.getElementById("abrir-mapa");
const botonCerrarMapa = document.getElementById("cerrar-mapa");
const ventanaMapa = document.getElementById("ventana-mapa");

// Variable para conservar el mapa
let mapa = null;


// =========================================
// INICIALIZAR MAPA LEAFLET
// =========================================

function inicializarMapa() {

    // Evita crear el mapa varias veces
    if (mapa !== null) {
        return;
    }

    // Crear mapa centrado en Nariño
    mapa = L.map("mapa").setView([1.2, -77.3], 8);

    // Agregar cartografía de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
}


// =========================================
// ABRIR VENTANA DEL MAPA
// =========================================

botonAbrirMapa.addEventListener("click", function () {

    ventanaMapa.hidden = false;

    inicializarMapa();

    // Ajustar el mapa al espacio disponible
    setTimeout(function () {
        mapa.invalidateSize();
    }, 150);

});


// =========================================
// CERRAR VENTANA DEL MAPA
// =========================================

botonCerrarMapa.addEventListener("click", function () {

    ventanaMapa.hidden = true;

});


// =========================================
// BÚSQUEDA DE ORIGEN Y DESTINO
// =========================================

const formularioRecorrido = document.getElementById("formulario-recorrido");
const campoOrigen = document.getElementById("origen");
const campoDestino = document.getElementById("destino");
const botonBuscar = document.getElementById("buscar-recorrido");
const informacionRecorrido = document.getElementById("informacion-recorrido");




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
        latitud: Number(resultados[0].lat),
        longitud: Number(resultados[0].lon)
    };

    lugaresConsultados.set(consulta.toLowerCase(), lugar);

    return lugar;
}


// =========================================
// ESPERA ENTRE CONSULTAS
// =========================================

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

        // Buscar primero el origen
        const lugarOrigen = await buscarLugar(origen);

        if (!lugarOrigen) {
            informacionRecorrido.textContent =
                "No encontramos el lugar de origen. Revisa el nombre e inténtalo nuevamente.";
            return;
        }

        // Respetar el intervalo entre consultas
        await esperar(1100);

        // Buscar el destino
        const lugarDestino = await buscarLugar(destino);

        if (!lugarDestino) {
            informacionRecorrido.textContent =
                "No encontramos el destino. Revisa el nombre e inténtalo nuevamente.";
            return;
        }

        // Eliminar marcadores anteriores
        if (marcadorOrigen) {
            mapa.removeLayer(marcadorOrigen);
        }

        if (marcadorDestino) {
            mapa.removeLayer(marcadorDestino);
        }

        // Colocar marcador del origen
        marcadorOrigen = L.marker([
            lugarOrigen.latitud,
            lugarOrigen.longitud
        ]).addTo(mapa);

        marcadorOrigen.bindPopup("Punto de partida").openPopup();

        // Colocar marcador del destino
        marcadorDestino = L.marker([
            lugarDestino.latitud,
            lugarDestino.longitud
        ]).addTo(mapa);

        marcadorDestino.bindPopup("Destino");

        // Ajustar el mapa para mostrar ambos lugares
        const limites = L.latLngBounds(
            [
                lugarOrigen.latitud,
                lugarOrigen.longitud
            ],
            [
                lugarDestino.latitud,
                lugarDestino.longitud
            ]
        );

        if (limites.getNorthEast().equals(limites.getSouthWest())) {
            mapa.setView(limites.getCenter(), 14);
        } else {
            mapa.fitBounds(limites, { padding: [50, 50] });
        }

        informacionRecorrido.textContent =
            "Origen: " + lugarOrigen.nombre +
            " | Destino: " + lugarDestino.nombre;

    } catch (error) {

        console.error("Error al buscar los lugares:", error);

        informacionRecorrido.textContent =
            "Ocurrió un problema al buscar los lugares. Inténtalo nuevamente.";

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
        lat: 1.2218582,
        lng: -77.3591903
    },

    "Tumaco": {
        lat: 1.8086735,
        lng: -78.7666995
    },

    "Playa del Morro": {
        lat: 1.8300625,
        lng: -78.7327653
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