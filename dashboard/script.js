
/* ===== CARRUSEL AUTOMÁTICO ===== */

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

