/* ===== Manejo de los productos ===== */
/* Consumo la fakestoreapi, muestro las cards y el modal con el detalle */

const URL_API = "https://fakestoreapi.com";

// aca guardo todos los productos que traigo de la api
let todosLosProductos = [];

// referencia al modal de bootstrap (lo creo una sola vez)
let modalProducto;

document.addEventListener("DOMContentLoaded", function () {
  modalProducto = new bootstrap.Modal(document.getElementById("modalProducto"));
  traerProductos();
});

// traigo todos los productos de la api
async function traerProductos() {
  try {
    let respuesta = await fetch(URL_API + "/products");
    let datos = await respuesta.json();
    todosLosProductos = datos;

    document.getElementById("cargando").classList.add("d-none");
    mostrarProductos(todosLosProductos);
  } catch (error) {
    document.getElementById("cargando").classList.add("d-none");
    console.log("Error al traer los productos: " + error);
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: "No se pudieron cargar los productos. Intenta mas tarde.",
      confirmButtonColor: "#0d9488"
    });
  }
}

// muestra en pantalla la lista de productos que le paso
function mostrarProductos(lista) {
  let contenedor = document.getElementById("contenedorProductos");
  contenedor.innerHTML = "";

  lista.forEach(function (producto) {
    let columna = document.createElement("div");
    columna.className = "col-6 col-md-4 col-lg-3";

    columna.innerHTML = `
      <div class="card card-producto" onclick="abrirModal(${producto.id})">
        <div class="img-caja">
          <img src="${producto.image}" alt="${producto.title}">
        </div>
        <div class="card-body d-flex flex-column">
          <h2 class="card-title">${producto.title}</h2>
          <p class="precio-card mt-auto">$ ${producto.price.toFixed(2)}</p>
          <button class="btn btn-agregar btn-sm">
            <i class="bi bi-eye"></i> Ver detalle
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(columna);
  });
}

// abre el modal con el detalle del producto (titulo, precio, descripcion, imagen)
function abrirModal(id) {
  let producto = todosLosProductos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById("tituloModal").textContent = producto.title;
  document.getElementById("precioModal").textContent = "$ " + producto.price.toFixed(2);
  document.getElementById("imagenModal").src = producto.image;
  document.getElementById("imagenModal").alt = producto.title;
  document.getElementById("descripcionModal").textContent = producto.description;

  // configuro el boton de agregar al carrito de este producto
  let botonAgregar = document.getElementById("btnAgregarModal");
  botonAgregar.onclick = function () {
    agregarAlCarrito(producto);
    // al agregar al carrito el modal se cierra y vuelvo al listado
    modalProducto.hide();
  };

  modalProducto.show();
}
