from flask import Blueprint, jsonify, render_template, request


main = Blueprint("main", __name__)


PRODUCTOS = {
    "audifonos": {
        "nombre": "Audífonos inalámbricos",
        "precio": 89.90,
        "stock": 12,
    },
    "teclado": {
        "nombre": "Teclado mecánico",
        "precio": 149.90,
        "stock": 8,
    },
    "mouse": {
        "nombre": "Mouse inalámbrico",
        "precio": 59.90,
        "stock": 20,
    },
}

CANTIDAD_MAXIMA = 100


@main.route("/")
def inicio():
    return render_template(
        "index.html",
        productos=PRODUCTOS,
    )


@main.route("/api/cotizar", methods=["POST"])
def cotizar():
    datos = request.get_json(silent=True) or {}

    producto_id = str(datos.get("producto", "")).strip()
    cantidad_recibida = datos.get("cantidad")

    if producto_id not in PRODUCTOS:
        return jsonify({
            "correcto": False,
            "mensaje": "Selecciona un producto válido.",
        }), 400

    try:
        cantidad = int(cantidad_recibida)
    except (TypeError, ValueError):
        return jsonify({
            "correcto": False,
            "mensaje": "La cantidad debe ser un número entero.",
        }), 400

    if cantidad <= 0:
        return jsonify({
            "correcto": False,
            "mensaje": "La cantidad debe ser mayor que cero.",
        }), 400

    if cantidad > CANTIDAD_MAXIMA:
        return jsonify({
            "correcto": False,
            "mensaje": (
                f"La cantidad máxima permitida es "
                f"{CANTIDAD_MAXIMA} unidades."
            ),
        }), 400

    producto = PRODUCTOS[producto_id]

    if cantidad > producto["stock"]:
        return jsonify({
            "correcto": False,
            "mensaje": (
                f"Stock insuficiente. Solo hay "
                f"{producto['stock']} unidades disponibles."
            ),
        }), 400

    total = round(producto["precio"] * cantidad, 2)

    return jsonify({
        "correcto": True,
        "mensaje": "Cotización calculada correctamente.",
        "cotizacion": {
            "producto": producto["nombre"],
            "precio_unitario": producto["precio"],
            "cantidad": cantidad,
            "total": total,
            "estado": "Disponible",
        },
    })