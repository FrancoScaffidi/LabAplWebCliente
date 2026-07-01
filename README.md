# MiTienda - E-commerce

Trabajo práctico de la materia **Laboratorio de Aplicaciones Web Cliente**.

Es una aplicación web de e-commerce que consume productos desde una API, los
muestra en cards y permite agregarlos a un carrito de compras que se guarda en
el `localStorage` del navegador.

## Funcionalidades

- Listado de productos consumidos desde la API mostrados en cards.
- Modal con el detalle de cada producto (título, precio, descripción e imagen).
- El modal se cierra desde la "X" o desde el botón "Agregar al carrito".
- Al agregar un producto se guarda en el `localStorage` y se avisa al usuario.
- Ícono de carrito en la barra de navegación con un badge que muestra la
  cantidad total de productos.
- Sidebar del carrito donde cada producto tiene: imagen, título, botón (-),
  cantidad, botón (+), botón eliminar y el precio final.
  - El botón (-) se deshabilita cuando la cantidad es 1.
  - Cada acción actualiza el `localStorage`.
- Botón "Finalizar compra" que vacía el carrito y avisa al usuario.
- Botón "Eliminar todos los productos" que vacía el carrito.
- Los botones no aparecen cuando el carrito está vacío.
- Buscador para filtrar productos por nombre.
- Navegación por categorías.

## Tecnologías usadas

- HTML5 (etiquetas semánticas: `header`, `nav`, `main`, `section`, `footer`)
- CSS3 + Bootstrap 5
- JavaScript (DOM, Fetch, Local Storage)
- [SweetAlert2](https://sweetalert2.github.io/) para los mensajes al usuario
- [Bootstrap Icons](https://icons.getbootstrap.com/) para los íconos
- API: [Fake Store API](https://fakestoreapi.com/)

## Cómo ejecutar el proyecto

No necesita instalación. Solo hay que abrir el archivo `index.html` en el
navegador (se recomienda usar la extensión *Live Server* de VS Code).

## Estructura del proyecto

```
LabAplWebCliente/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   ├── productos.js   (listado, modal, buscador y categorías)
│   └── carrito.js     (lógica del carrito + localStorage)
└── README.md
```

## Integrantes

Este trabajo práctico fue realizado de manera individual.

| Nombre | Usuario de GitHub | Aporte |
|--------|-------------------|--------|
| Scaffidi, Franco Lautaro | @Lautaro__ | Desarrollo completo de la aplicación: maquetado HTML, estilos CSS, consumo de la API, lógica del carrito y funcionalidades. |
