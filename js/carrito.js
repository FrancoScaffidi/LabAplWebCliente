/* ===== Logica del carrito de compras ===== */
/* Todo se guarda en el localStorage con la clave "carrito" */

const CLAVE_CARRITO = "carrito";

// traigo el carrito del localStorage. Si no hay nada devuelvo un array vacio
function obtenerCarrito() {
  let datos = localStorage.getItem(CLAVE_CARRITO);
  if (datos == null) {
    return [];
  }
  return JSON.parse(datos);
}

// guardo el carrito en el localStorage
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// agrega un producto al carrito. Si ya estaba, le suma 1 a la cantidad
function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();

  // busco si el producto ya esta en el carrito
  let existe = carrito.find(p => p.id === producto.id);

  if (existe) {
    existe.cantidad = existe.cantidad + 1;
  } else {
    // guardo solo los datos que necesito para el carrito
    carrito.push({
      id: producto.id,
      title: producto.title,
      price: producto.price,
      image: producto.image,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  mostrarCarrito();

  // mensaje al usuario (con sweetalert)
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Producto agregado al carrito",
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true
  });
}

// suma o resta cantidad segun el valor de "cambio" (+1 o -1)
function cambiarCantidad(id, cambio) {
  let carrito = obtenerCarrito();
  let producto = carrito.find(p => p.id === id);

  if (!producto) return;

  producto.cantidad = producto.cantidad + cambio;

  // por las dudas no dejo que baje de 1
  if (producto.cantidad < 1) {
    producto.cantidad = 1;
  }

  guardarCarrito(carrito);
  mostrarCarrito();
}

// elimina un producto del carrito
function eliminarProducto(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito(carrito);
  mostrarCarrito();
}

// vacia todo el carrito y borra el localStorage
function vaciarCarrito() {
  Swal.fire({
    title: "¿Vaciar el carrito?",
    text: "Se van a eliminar todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, vaciar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#dc3545"
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      localStorage.removeItem(CLAVE_CARRITO);
      mostrarCarrito();
      Swal.fire({
        icon: "success",
        title: "Carrito vaciado",
        confirmButtonColor: "#0d9488"
      });
    }
  });
}

// finaliza la compra: limpia el carrito, borra el localStorage y avisa
function finalizarCompra() {
  localStorage.removeItem(CLAVE_CARRITO);
  mostrarCarrito();
  Swal.fire({
    icon: "success",
    title: "¡Gracias por tu compra!",
    text: "Tu pedido fue realizado con exito",
    confirmButtonColor: "#0d9488"
  });
}

// actualiza el numerito (badge) del carrito en la navbar
function actualizarBadge() {
  let carrito = obtenerCarrito();

  // sumo todas las cantidades (no la cantidad de productos distintos)
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cantidad;
  }

  let badge = document.getElementById("badgeCarrito");
  badge.textContent = total;

  // si no hay nada oculto el badge
  if (total === 0) {
    badge.style.display = "none";
  } else {
    badge.style.display = "block";
  }
}

// dibuja todo el carrito en el sidebar
function mostrarCarrito() {
  let carrito = obtenerCarrito();
  let contenedor = document.getElementById("itemsCarrito");
  let mensajeVacio = document.getElementById("carritoVacio");
  let acciones = document.getElementById("accionesCarrito");

  contenedor.innerHTML = "";

  // si el carrito esta vacio muestro el mensaje y escondo los botones
  if (carrito.length === 0) {
    mensajeVacio.classList.remove("d-none");
    acciones.classList.add("d-none");
    actualizarBadge();
    return;
  }

  mensajeVacio.classList.add("d-none");
  acciones.classList.remove("d-none");

  // recorro los productos y armo el html de cada uno
  carrito.forEach(function (producto) {
    let subtotal = producto.price * producto.cantidad;

    // el boton (-) se deshabilita cuando la cantidad es 1
    let menosDeshabilitado = producto.cantidad === 1 ? "disabled" : "";

    let item = document.createElement("div");
    item.className = "item-carrito";
    item.innerHTML = `
      <img src="${producto.image}" alt="${producto.title}">
      <div class="w-100">
        <p class="titulo-item">${producto.title}</p>
        <div class="controles">
          <button class="btn btn-outline-secondary btn-cantidad" ${menosDeshabilitado}
                  onclick="cambiarCantidad(${producto.id}, -1)">
            <i class="bi bi-dash"></i>
          </button>
          <span class="cantidad">${producto.cantidad}</span>
          <button class="btn btn-outline-secondary btn-cantidad" onclick="cambiarCantidad(${producto.id}, 1)">
            <i class="bi bi-plus"></i>
          </button>
          <button class="btn btn-danger btn-cantidad" onclick="eliminarProducto(${producto.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
        <div class="subtotal">Total: $ ${subtotal.toFixed(2)}</div>
      </div>
    `;

    contenedor.appendChild(item);
  });

  actualizarBadge();
}

// cuando carga la pagina muestro como esta el carrito (por si quedo algo guardado)
document.addEventListener("DOMContentLoaded", mostrarCarrito);
