
document.addEventListener("DOMContentLoaded", function () {

    const avatar = document.getElementById("cuenta-avatar");
    const nombrePerfil = document.getElementById("cuenta-nombre");
    const fechaPerfil = document.getElementById("cuenta-fecha");


    const selectorFoto = document.getElementById("perfil-foto");
    const botonQuitarFoto = document.getElementById("quitar-foto");


    const campoNombre = document.getElementById("perfil-nombre");
    const campoApellido = document.getElementById("perfil-apellido");
    const campoCorreo = document.getElementById("perfil-correo");

    const formulario = document.getElementById("formulario-perfil");
    const mensaje = document.getElementById("mensaje-perfil");
    const botonGuardar = formulario.querySelector('[type="submit"]');

    let usuarioActual = null;

    // Obtener el nombre que debe mostrarse en el perfil.
    function obtenerNombreVisible(usuario) {
        const nombre = (usuario.nombre || "").trim();
        const apellido = (usuario.apellido || "").trim();

        const personalizado = `${nombre} ${apellido}`.trim();

        return personalizado || usuario.nombre_predeterminado || "Viajero";
    }

    // Mostrar la inicial o la foto, si ya existe.

    function mostrarAvatar(usuario) {
        const nombreVisible = obtenerNombreVisible(usuario);

        avatar.replaceChildren();

        if (usuario.foto_perfil) {
            const imagen = document.createElement("img");



            imagen.src = usuario.foto_perfil;
            imagen.alt = "Foto de perfil";

            imagen.onerror = function () {
                avatar.replaceChildren();
                avatar.textContent =
                    obtenerNombreVisible(usuario).charAt(0).toUpperCase();
            };

            avatar.appendChild(imagen);
        } else {
            avatar.textContent = nombreVisible.charAt(0).toUpperCase();
        }

        botonQuitarFoto.hidden = !usuario.foto_perfil;
    }


    // Mostrar los datos de la cuenta.
    function mostrarDatos(usuario) {
        usuarioActual = usuario;

        nombrePerfil.textContent = obtenerNombreVisible(usuario);

        mostrarAvatar(usuario);

        campoNombre.value = usuario.nombre || "";
        campoApellido.value = usuario.apellido || "";
        campoCorreo.value = usuario.correo || "";

        if (usuario.fecha_registro) {
            const fecha = new Date(
                usuario.fecha_registro.replace(" ", "T")
            );

            fechaPerfil.textContent = !Number.isNaN(fecha.getTime())
                ? "En Wayra Kawsay desde " +
                fecha.toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })
                : "Fecha de registro no disponible";
        } else {
            fechaPerfil.textContent = "Fecha de registro no disponible";
        }
    }


    // Seleccionar y guardar una nueva foto de perfil.
    selectorFoto.addEventListener("change", async function () {
        const archivo = selectorFoto.files[0];

        if (!archivo) {
            return;
        }

        // Comprobar el tamaño antes de enviarlo.
        if (archivo.size > 2 * 1024 * 1024) {
            mensaje.textContent = "La imagen no puede superar los 2 MB.";
            mensaje.style.color = "#B42318";
            selectorFoto.value = "";
            return;
        }

        // Comprobar los formatos admitidos.
        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!tiposPermitidos.includes(archivo.type)) {
            mensaje.textContent = "Selecciona una imagen JPG, PNG o WEBP.";
            mensaje.style.color = "#B42318";
            selectorFoto.value = "";
            return;
        }

        const datos = new FormData();
        datos.append("foto_perfil", archivo);

        selectorFoto.disabled = true;
        mensaje.textContent = "Guardando foto...";
        mensaje.style.color = "#647568";

        try {
            const respuesta = await fetch(
                "../config/actualizar_foto.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    body: datos
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudo guardar la foto."
                );
            }

            // Volver a consultar los datos del usuario.
            await cargarPerfil();

            mensaje.textContent = resultado.mensaje;
            mensaje.style.color = "#315B43";

        } catch (error) {
            console.error("Error al guardar la foto:", error);

            mensaje.textContent =
                error.message || "Ocurrió un error al subir la foto.";

            mensaje.style.color = "#B42318";

        } finally {
            selectorFoto.disabled = false;
            selectorFoto.value = "";
        }
    });

    // Quitar la foto y volver a mostrar la inicial.
    botonQuitarFoto.addEventListener("click", async function () {
        mensaje.textContent =
            "Todavía falta conectar la eliminación de la foto.";
        mensaje.style.color = "#647568";
    });


    // Consultar los datos reales de la sesión.
    async function cargarPerfil() {
        try {
            const respuesta = await fetch(
                "../config/verificar_sesion.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const usuario = await respuesta.json();

            if (!respuesta.ok || !usuario.exito) {
                mensaje.textContent =
                    "Debes iniciar sesión para consultar tu perfil.";

                formulario.hidden = true;
                return;
            }

            formulario.hidden = false;
            mostrarDatos(usuario);

        } catch (error) {
            console.error("Error al cargar el perfil:", error);

            mensaje.textContent =
                "No se pudieron cargar los datos. Recarga la página.";
        }
    }


    // Guardar el nombre y el apellido.
    formulario.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        mensaje.textContent = "";
        botonGuardar.disabled = true;
        botonGuardar.textContent = "Guardando...";

        try {
            const datos = new FormData();

            datos.append("nombre", campoNombre.value.trim());
            datos.append("apellido", campoApellido.value.trim());

            const respuesta = await fetch(
                "../config/actualizar_perfil.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    body: datos
                }
            );

            const textoRespuesta = await respuesta.text();

            console.log("Estado HTTP:", respuesta.status);
            console.log("Respuesta de actualizar_perfil.php:", textoRespuesta);

            let resultado;

            try {
                resultado = JSON.parse(textoRespuesta);
            } catch (error) {
                throw new Error(
                    "PHP no devolvió JSON válido. Revisa la respuesta en la consola."
                );
            }

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudieron guardar los cambios."
                );
            }

            // Consultar nuevamente para mostrar los datos guardados.
            await cargarPerfil();

            mensaje.textContent = resultado.mensaje;
            mensaje.style.color = "#315B43";

        } catch (error) {
            console.error("Error al guardar el perfil:", error);

            mensaje.textContent =
                error.message || "Ocurrió un error al guardar los cambios.";

            mensaje.style.color = "#B42318";

        } finally {
            botonGuardar.disabled = false;
            botonGuardar.textContent = "Guardar cambios";
        }
    });



    // Cambiar la sección seleccionada del menú lateral.
    const enlaces = document.querySelectorAll(".cuenta-enlace");


    const contenidoCuenta = document.getElementById("contenido-cuenta");

    // Guardar el contenido original de Editar perfil.
    const contenidoPerfil = Array.from(contenidoCuenta.childNodes);

    // Mostrar los destinos que el usuario guardó como favoritos.

    async function mostrarDestinosFavoritos() {



        contenidoCuenta.innerHTML = `
        <h1>Mis destinos favoritos</h1>
        <p class="cuenta-descripcion">
            Aquí encontrarás los destinos que has guardado.
        </p>
        <p id="estado-favoritos">Cargando tus destinos favoritos...</p>
        <div id="lista-destinos-favoritos" class="lista-destinos-favoritos"></div>
    `;

        const estado = document.getElementById("estado-favoritos");
        const lista = document.getElementById("lista-destinos-favoritos");

        // Información visual de cada destino.
        const informacionDestinos = {
            cocha: {
                nombre: "Laguna de La Cocha",
                imagen: "imagenes/cocha2.jpg",
                descripcion: "Descubre los paisajes, las aguas tranquilas y el encanto natural de uno de los lugares más representativos de Nariño.",
                enlace: "destinos.html?destino=cocha"
            },
            lajas: {
                nombre: "Santuario de Las Lajas",
                imagen: "imagenes/lajas3.jpg",
                descripcion: "Descubre un lugar donde la arquitectura, la historia y la espiritualidad se encuentran en medio de un paisaje extraordinario.",
                enlace: "destinos.html?destino=lajas"
            }, volcan: {
                nombre: "Volcan Galeras",
                imagen: "imagenes/volcan11.jpg",
                descripcion: "Contempla los paisajes andinos y la riqueza natural que rodea a uno de los volcanes más reconocidos del departamento.",
                enlace: "destinos.html?destino=volcan"
            }
            ,
            museo: {
                nombre: "Museo del Oro",
                imagen: "imagenes/museo1.jpg",
                descripcion: "Acércate a la historia y al patrimonio arqueológico de la región a través de las piezas y expresiones de sus culturas ancestrales.",
                enlace: "destinos.html?destino=museo"
            }, gradas: {
                nombre: "Gradas de Belen",
                imagen: "imagenes/belen1.webp",
                descripcion: "Explora un rincón de Nariño que invita a descubrir sus paisajes, su entorno natural y el encanto de sus caminos.",
                enlace: "destinos.html?destino=belen"
            }, cruz: {
                nombre: "Laguna de la Cruz-Tajumbina",
                imagen: "imagenes/cruz1.jpeg",
                descripcion: "Disfruta de un entorno natural rodeado de montañas y descubre los atractivos que hacen especial a esta zona de Nariño.",
                enlace: "destinos.html?destino=cruz"
            }, pi: {
                nombre: "katza-pi",
                imagen: "imagenes/pi2.jpeg",
                descripcion: "Descubre los paisajes y la riqueza natural de Ricaurte, un territorio nariñense que guarda atractivos por explorar.",
                enlace: "destinos.html?destino=pi"
            }









        };

        try {
            const respuesta = await fetch(
                "../config/ver_destinos_favoritos.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudieron cargar tus favoritos."
                );
            }

            if (resultado.destinos.length === 0) {
                estado.textContent =
                    "Todavía no has guardado destinos favoritos.";
                return;
            }

            estado.remove();

            resultado.destinos.forEach(function (destino) {
                const informacion = informacionDestinos[destino.destino_id];

                if (!informacion) {
                    console.warn(
                        "Falta la información visual para el destino:",
                        destino.destino_id
                    );
                    return;
                }

                const enlace = document.createElement("a");
                enlace.className = "tarjeta-destino-favorito";
                enlace.href = informacion.enlace;

                const imagen = document.createElement("img");
                imagen.src = informacion.imagen;
                imagen.alt = informacion.nombre;


                const contenido = document.createElement("div");
                contenido.className = "contenido-favorito";

                const nombre = document.createElement("h2");
                nombre.textContent = informacion.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = informacion.descripcion;

                const verDestino = document.createElement("span");
                verDestino.className = "enlace-ver-destino";
                verDestino.textContent = "Ver destino →";

                contenido.append(nombre, descripcion, verDestino);
                enlace.append(imagen, contenido);
                lista.appendChild(enlace);
            });

            if (!lista.children.length) {
                estado.textContent =
                    "Estamos preparando la información de tus destinos favoritos.";
                lista.appendChild(estado);
            }

        } catch (error) {
            console.error("Error al cargar destinos favoritos:", error);
            estado.textContent =
                error.message || "Ocurrió un error al cargar tus favoritos.";
        }
    }




    async function mostrarEventosFavoritos() {
        contenidoCuenta.innerHTML = `
        <h1>Mis eventos favoritos</h1>
        <p class="cuenta-descripcion">
            Descubre las festividades, tradiciones y expresiones culturales de Nariño que has guardado.
        </p>
        <p id="estado-favoritos">Cargando tus eventos favoritos...</p>
        <div id="lista-destinos-favoritos" class="lista-destinos-favoritos"></div>
    `;

        const estado = document.getElementById("estado-favoritos");
        const lista = document.getElementById("lista-destinos-favoritos");

        const eventosDisponibles = {
            carnaval: {
                nombre: "Carnaval de Negros y Blancos",
                imagen: "imagenes/carnaval1.jpg",
                descripcion: "Vive una celebración llena de color, creatividad y tradición, reconocida por sus comparsas, carrozas y expresiones culturales.",
                enlace: "eventos.html?evento=carnaval"
            },
            cuy: {
                nombre: "Festival del Cuy",
                imagen: "imagenes/cuy1.jpg",
                descripcion: "Conoce una tradición emblemática de Nariño que reúne gastronomía, costumbres locales y encuentros culturales.",
                enlace: "eventos.html?evento=cuy"
            },
            currulao: {
                nombre: "Festival Internacional del Currulao",
                imagen: "imagenes/currulao1.jpeg",
                descripcion: "Descubre los sonidos, las danzas y las tradiciones afro del Pacífico en una celebración de su riqueza cultural.",
                enlace: "eventos.html?evento=currulao"
            },
            rosario: {
                nombre: "Fiesta de la Virgen del Rosario",
                imagen: "imagenes/virgen2.jpeg",
                descripcion: "Acércate a una celebración de fe y tradición que reúne expresiones religiosas y culturales de la comunidad.",
                enlace: "eventos.html?evento=rosario"
            },
            musica: {
                nombre: "Festival de Música de Cuerdas",
                imagen: "imagenes/tambo1.jpg",
                descripcion: "Disfruta de una celebración musical que destaca los sonidos de los instrumentos de cuerda y las tradiciones artísticas de la región.",
                enlace: "eventos.html?evento=musica"
            }
        };

        try {
            const respuesta = await fetch(
                "../config/ver_eventos_favoritos.php",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudieron cargar tus eventos favoritos."
                );
            }

            if (resultado.eventos.length === 0) {
                estado.textContent = "Todavía no has guardado eventos favoritos.";
                return;
            }

            estado.remove();

            resultado.eventos.forEach(evento => {
                const informacion = eventosDisponibles[evento.evento_id];

                if (!informacion) {
                    console.warn(
                        "Falta la información visual para el evento:",
                        evento.evento_id
                    );
                    return;
                }

                const tarjeta = document.createElement("a");
                tarjeta.className = "tarjeta-destino-favorito";
                tarjeta.href = informacion.enlace;

                const imagen = document.createElement("img");
                imagen.src = informacion.imagen;
                imagen.alt = informacion.nombre;

                imagen.onerror = function () {
                    console.error(
                        "No se encontró la imagen del evento:",
                        informacion.imagen
                    );
                };

                const contenido = document.createElement("div");
                contenido.className = "contenido-favorito";

                const nombre = document.createElement("h2");
                nombre.textContent = informacion.nombre;

                const descripcion = document.createElement("p");
                descripcion.textContent = informacion.descripcion;

                const verEvento = document.createElement("span");
                verEvento.className = "enlace-ver-destino";
                verEvento.textContent = "Ver evento →";

                contenido.append(nombre, descripcion, verEvento);
                tarjeta.append(imagen, contenido);
                lista.appendChild(tarjeta);
            });

            if (!lista.children.length) {
                estado.textContent =
                    "No encontramos información para los eventos guardados.";
                lista.appendChild(estado);
            }

        } catch (error) {
            console.error("Error al cargar eventos favoritos:", error);
            estado.textContent =
                error.message || "Ocurrió un error al cargar tus eventos favoritos.";
        }
    }



    async function mostrarCronograma() {
        contenidoCuenta.innerHTML = `
        <h1>Mi cronograma</h1>

        <p class="cuenta-descripcion">
            Organiza las festividades de Nariño y ten presentes sus fechas.
        </p>

        <div class="calendario-contenedor">
            <div class="calendario-encabezado">
                <button type="button" id="mes-anterior" aria-label="Mes anterior">
                    &#10094;
                </button>

                <h2 id="mes-anio"></h2>

                <button type="button" id="mes-siguiente" aria-label="Mes siguiente">
                    &#10095;
                </button>
            </div>

            <div class="calendario-dias-semana">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
            </div>

            <div id="calendario-dias" class="calendario-dias"></div>
        </div>

        <div class="eventos-del-mes">
            <h2>Festividades del mes</h2>
            <p id="estado-cronograma">Cargando tus festividades...</p>
            <div id="lista-cronograma"></div>
        </div>
    `;

        const estado = document.getElementById("estado-cronograma");
        const lista = document.getElementById("lista-cronograma");
        const calendario = document.getElementById("calendario-dias");
        const tituloMes = document.getElementById("mes-anio");

        const botonAnterior = document.getElementById("mes-anterior");
        const botonSiguiente = document.getElementById("mes-siguiente");

        const hoy = new Date();
        let mesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        let eventosGuardados = [];

        // Convertir una fecha YYYY-MM-DD sin problemas de zona horaria.
        function convertirFecha(fecha) {
            if (!fecha) return null;

            const partes = fecha.split("-").map(Number);

            if (partes.length !== 3 || partes.some(Number.isNaN)) {
                return null;
            }

            const fechaLocal = new Date(partes[0], partes[1] - 1, partes[2]);

            if (
                fechaLocal.getFullYear() !== partes[0] ||
                fechaLocal.getMonth() !== partes[1] - 1 ||
                fechaLocal.getDate() !== partes[2]
            ) {
                return null;
            }

            return fechaLocal;
        }

        function mismaFecha(a, b) {
            return a.getFullYear() === b.getFullYear() &&
                a.getMonth() === b.getMonth() &&
                a.getDate() === b.getDate();
        }

        // Comprobar si un evento abarca un día concreto.
        function eventoIncluyeDia(evento, fecha) {
            const inicio = convertirFecha(evento.fecha_inicio);
            const fin = convertirFecha(evento.fecha_fin);

            if (!inicio || !fin) return false;

            return fecha >= inicio && fecha <= fin;
        }

        function dibujarCalendario() {
            calendario.replaceChildren();

            tituloMes.textContent = mesActual.toLocaleDateString("es-CO", {
                month: "long",
                year: "numeric"
            });

            const anio = mesActual.getFullYear();
            const mes = mesActual.getMonth();

            const primerDia = new Date(anio, mes, 1);
            const desplazamiento = (primerDia.getDay() + 6) % 7;
            const cantidadDias = new Date(anio, mes + 1, 0).getDate();

            // Espacios vacíos antes del primer día del mes.
            for (let i = 0; i < desplazamiento; i++) {
                const espacio = document.createElement("div");
                espacio.setAttribute("aria-hidden", "true");
                calendario.appendChild(espacio);
            }

            for (let numero = 1; numero <= cantidadDias; numero++) {
                const fecha = new Date(anio, mes, numero);

                const dia = document.createElement("div");
                dia.className = "dia-calendario";

                const numeroDia = document.createElement("span");
                numeroDia.textContent = numero;
                dia.appendChild(numeroDia);

                if (mismaFecha(fecha, hoy)) {
                    dia.classList.add("hoy");
                    dia.setAttribute("aria-label", numero + ", hoy");
                }

                const eventosDelDia = eventosGuardados.filter(evento =>
                    eventoIncluyeDia(evento, fecha)
                );



                if (eventosDelDia.length > 0) {
                    dia.classList.add("tiene-evento");

                    eventosDelDia.forEach(evento => {
                        const nombreEvento = document.createElement("span");
                        nombreEvento.className = "nombre-evento-calendario";

                        // Asignar un color según el identificador de la festividad.
                        nombreEvento.classList.add(
                            "evento-" + evento.evento_id
                        );

                        nombreEvento.textContent = evento.nombre;
                        dia.appendChild(nombreEvento);
                    });
                }



                calendario.appendChild(dia);
            }

            mostrarEventosDelMes();
        }

        function mostrarEventosDelMes() {
            lista.replaceChildren();

            const anio = mesActual.getFullYear();
            const mes = mesActual.getMonth();

            const eventosDelMes = eventosGuardados.filter(evento => {
                const inicio = convertirFecha(evento.fecha_inicio);
                const fin = convertirFecha(evento.fecha_fin);

                if (!inicio || !fin) return false;

                const primerDiaMes = new Date(anio, mes, 1);
                const ultimoDiaMes = new Date(anio, mes + 1, 0);

                return inicio <= ultimoDiaMes && fin >= primerDiaMes;
            });

            if (eventosDelMes.length === 0) {
                estado.textContent =
                    "No tienes festividades guardadas para este mes.";
                return;
            }

            estado.textContent = "";

            eventosDelMes.forEach(evento => {
                const tarjeta = document.createElement("article");
                tarjeta.className = "tarjeta-cronograma";

                const nombre = document.createElement("h3");
                nombre.textContent = evento.nombre;

                const fechas = document.createElement("p");
                const inicio = convertirFecha(evento.fecha_inicio);
                const fin = convertirFecha(evento.fecha_fin);

                if (inicio && fin) {
                    const opciones = {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    };

                    fechas.textContent =
                        "Del " + inicio.toLocaleDateString("es-CO", opciones) +
                        " al " + fin.toLocaleDateString("es-CO", opciones);
                } else {
                    fechas.textContent = "Fechas por confirmar";
                }

                const enlace = document.createElement("a");
                enlace.href = "eventos.html?evento=" +
                    encodeURIComponent(evento.evento_id);
                enlace.className = "enlace-ver-destino";
                enlace.textContent = "Ver evento →";

                tarjeta.append(nombre, fechas, enlace);
                lista.appendChild(tarjeta);
            });
        }

        botonAnterior.addEventListener("click", function () {
            mesActual = new Date(
                mesActual.getFullYear(),
                mesActual.getMonth() - 1,
                1
            );

            dibujarCalendario();
        });

        botonSiguiente.addEventListener("click", function () {
            mesActual = new Date(
                mesActual.getFullYear(),
                mesActual.getMonth() + 1,
                1
            );

            dibujarCalendario();
        });

        try {
            const respuesta = await fetch("../config/ver_cronograma.php", {
                method: "GET",
                credentials: "same-origin"
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.exito) {
                throw new Error(
                    resultado.mensaje || "No se pudo cargar tu cronograma."
                );
            }

            eventosGuardados = resultado.eventos || [];

            dibujarCalendario();

        } catch (error) {
            console.error("Error al cargar el cronograma:", error);

            estado.textContent =
                error.message || "Ocurrió un error al cargar tu cronograma.";
        }
    }





    // Controlar qué contenido aparece al seleccionar cada opción.
    enlaces.forEach(function (enlace) {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();

            enlaces.forEach(function (otro) {
                otro.classList.remove("activo");
            });

            enlace.classList.add("activo");


            const seccion = enlace.dataset.seccion;


            if (seccion === "destinos-favoritos") {
                mostrarDestinosFavoritos();

            } else if (seccion === "eventos-favoritos") {
                mostrarEventosFavoritos();

            } else if (seccion === "cronograma") {
                mostrarCronograma();

            } else if (seccion === "editar-perfil") {
                contenidoCuenta.replaceChildren(...contenidoPerfil);
                cargarPerfil();
            } else {
                contenidoCuenta.innerHTML = `
                    <h1>${enlace.textContent.trim()}</h1>
                    <p class="cuenta-descripcion">
                        Esta sección estará disponible próximamente.
                    </p>
                `;
            }
        });
    });




    // Cargar el perfil y abrir la sección solicitada en la URL.
    cargarPerfil();

    const parametrosURL = new URLSearchParams(window.location.search);
    const seccionSolicitada = parametrosURL.get("seccion");

    if (seccionSolicitada) {
        const enlaceSolicitado = document.querySelector(
            `.cuenta-enlace[data-seccion="${seccionSolicitada}"]`
        );

        if (enlaceSolicitado) {
            enlaceSolicitado.click();
        }
    }

});

