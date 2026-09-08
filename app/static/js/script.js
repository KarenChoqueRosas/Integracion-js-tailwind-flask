const formulario = document.getElementById("formulario-cotizacion");
const productoInput = document.getElementById("producto");
const cantidadInput = document.getElementById("cantidad");
const botonCalcular = document.getElementById("boton-calcular");
const mensajeError = document.getElementById("mensaje-error");

const resumenProducto = document.getElementById("resumen-producto");
const resumenPrecio = document.getElementById("resumen-precio");
const resumenCantidad = document.getElementById("resumen-cantidad");
const resumenTotal = document.getElementById("resumen-total");
const estado = document.getElementById("estado");


function convertirASoles(valor) {
    return `S/ ${Number(valor).toFixed(2)}`;
}


function mostrarError(mensaje) {
    mensajeError.textContent = mensaje;
    mensajeError.classList.remove("hidden");
}


function ocultarError() {
    mensajeError.textContent = "";
    mensajeError.classList.add("hidden");
}


function cambiarEstadoCarga(cargando) {
    botonCalcular.disabled = cargando;

    botonCalcular.textContent = cargando
        ? "Calculando..."
        : "Calcular pedido";
}


function mostrarCotizacion(cotizacion) {
    resumenProducto.textContent = cotizacion.producto;
    resumenPrecio.textContent = convertirASoles(
        cotizacion.precio_unitario
    );
    resumenCantidad.textContent =
        `${cotizacion.cantidad} unidades`;
    resumenTotal.textContent = convertirASoles(cotizacion.total);

    estado.textContent = cotizacion.estado;
    estado.classList.add("estado-correcto");
}


async function solicitarCotizacion(producto, cantidad) {
    const respuesta = await fetch("/api/cotizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            producto,
            cantidad,
        }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || "No se pudo calcular la cotización."
        );
    }

    return datos;
}


formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    ocultarError();
    cambiarEstadoCarga(true);

    const producto = productoInput.value;
    const cantidad = Number(cantidadInput.value);

    try {
        const datos = await solicitarCotizacion(
            producto,
            cantidad
        );

        mostrarCotizacion(datos.cotizacion);
    } catch (error) {
        mostrarError(error.message);
    } finally {
        cambiarEstadoCarga(false);
    }
});