/* ===== Manejo de los productos ===== */
/* Consumo la fakestoreapi, muestro las cards, el modal, el buscador y las categorias */

const URL_API = "https://fakestoreapi.com";

// variables donde guardo el estado de la pagina
let todosLosProductos = [];   // aca guardo todos los productos que traigo de la api
let categoriaActual = "todos"; // la categoria que esta seleccionada
let textoBusqueda = "";        // lo que escribio el usuario en el buscador

// referencia al modal de bootstrap (lo creo una sola vez)
let modalProducto;

document.addEventListener("DOMContentLoaded", function () {
  modalProducto = new bootstrap.Modal(document.getElementById("modalProducto"));
  traerProductos();
  traerCategorias();

  // que el buscador filtre a medida que escribo
  document.getElementById("inputBuscar").addEventListener("input", buscarProductos);
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
    // si falla la api aviso al usuario
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

// traigo las categorias y armo los botones
async function traerCategorias() {
  try {
    let respuesta = await fetch(URL_API + "/products/categories");
    let categorias = await respuesta.json();

    let contenedor = document.getElementById("listaCategorias");

    // agrego primero el boton "Todos"
    contenedor.innerHTML = `
      <button class="btn btn-categoria activa" onclick="filtrarPorCategoria('todos', this)">Todos</button>
    `;

    // despues agrego una por cada categoria de la api
    categorias.forEach(function (cat) {
      let boton = document.createElement("button");
      boton.className = "btn btn-categoria";
      boton.textContent = cat;
      boton.setAttribute("onclick", `filtrarPorCategoria('${cat}', this)`);
      contenedor.appendChild(boton);
    });
  } catch (error) {
    console.log("Error al traer las categorias: " + error);
  }
}

// muestra en pantalla la lista de productos que le paso
function mostrarProductos(lista) {
  let contenedor = document.getElementById("contenedorProductos");
  let sinResultados = document.getElementById("sinResultados");
  contenedor.innerHTML = "";

  // si no hay productos muestro el cartel de "sin resultados"
  if (lista.length === 0) {
    sinResultados.classList.remove("d-none");
    return;
  }
  sinResultados.classList.add("d-none");

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
  // busco el producto por id
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

// filtra los productos por categoria
function filtrarPorCategoria(categoria, boton) {
  categoriaActual = categoria;

  // marco visualmente cual categoria quedo activa
  let botones = document.querySelectorAll(".btn-categoria");
  botones.forEach(b => b.classList.remove("activa"));
  if (boton) {
    boton.classList.add("activa");
  }

  aplicarFiltros();
}

// se ejecuta cuando escribo en el buscador
function buscarProductos() {
  textoBusqueda = document.getElementById("inputBuscar").value.toLowerCase();
  aplicarFiltros();
}

// junta el filtro de categoria + el del buscador y muestra el resultado
function aplicarFiltros() {
  let resultado = todosLosProductos;

  // primero filtro por categoria (si no es "todos")
  if (categoriaActual !== "todos") {
    resultado = resultado.filter(p => p.category === categoriaActual);
  }

  // despues filtro por el texto del buscador (busca en el titulo)
  if (textoBusqueda !== "") {
    resultado = resultado.filter(p => p.title.toLowerCase().includes(textoBusqueda));
  }

  mostrarProductos(resultado);
}
