// Solo corre este código si estamos en la página admin.html
const formLogin = document.getElementById("form-login");

if (formLogin) {
  formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault(); // evita que la página se recargue sola

    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    // Usuario y contraseña "correctos" (cámbialos por los que tú quieras)
    if (usuario === "inkverse" && clave === "admin2026") {
      sessionStorage.setItem("logueado", "true"); // guarda que sí inició sesión
      window.location.href = "panel.html"; // lo manda a la página de gestión
    } else {
      document.getElementById("error-msg").textContent = "Usuario o contraseña incorrectos.";
    }
  });
}
// Protección de panel.html: si no ha iniciado sesión, lo saca
if (window.location.pathname.includes("panel.html")) {
  const logueado = sessionStorage.getItem("logueado");
  if (logueado !== "true") {
    window.location.href = "admin.html";
  }
}

// Botón de cerrar sesión
const btnCerrar = document.getElementById("cerrar-sesion");
if (btnCerrar) {
  btnCerrar.addEventListener("click", function (evento) {
    evento.preventDefault();
    sessionStorage.removeItem("logueado");
    window.location.href = "admin.html";
  });
}
// ---------- CHATBOT ----------
const burbuja = document.getElementById("chat-burbuja");
const caja = document.getElementById("chat-caja");
const cerrar = document.getElementById("chat-cerrar");
const mensajesDiv = document.getElementById("chat-mensajes");
const input = document.getElementById("chat-input");
const btnEnviar = document.getElementById("chat-enviar");

if (burbuja) {
  // Abrir y cerrar el chat
  burbuja.addEventListener("click", function () {
    caja.classList.remove("oculto");
    burbuja.classList.add("oculto");
  });

  cerrar.addEventListener("click", function () {
    caja.classList.add("oculto");
    burbuja.classList.remove("oculto");
  });

  // Mensaje de bienvenida al cargar
  agregarMensaje("¡Hola! Soy Inkbot 🐰 Pregúntame sobre precios, productos o envíos.", "bot");

  // Al hacer clic en enviar o presionar Enter
  btnEnviar.addEventListener("click", manejarMensaje);
  input.addEventListener("keypress", function (evento) {
    if (evento.key === "Enter") manejarMensaje();
  });
}

function manejarMensaje() {
  const texto = input.value.trim();
  if (texto === "") return;

  agregarMensaje(texto, "usuario");
  input.value = "";

  const respuesta = generarRespuesta(texto.toLowerCase());
  setTimeout(function () {
    agregarMensaje(respuesta, "bot");
  }, 500); // pequeña pausa para que se sienta más natural
}

function agregarMensaje(texto, tipo) {
  const burbujaMensaje = document.createElement("div");
  burbujaMensaje.classList.add("mensaje", tipo);
  burbujaMensaje.textContent = texto;
  mensajesDiv.appendChild(burbujaMensaje);
  mensajesDiv.scrollTop = mensajesDiv.scrollHeight; // baja el scroll al último mensaje
}

function generarRespuesta(mensaje) {
  if (mensaje.includes("precio") || mensaje.includes("cuesta") || mensaje.includes("vale")) {
    return "Los sueters cuestan $50.000 COP, los totebags entre $30.000 y $40.000 COP, y los accesorios desde $5.000 COP.";
  }
  if (mensaje.includes("sueter") || mensaje.includes("suéter")) {
    return "Tenemos sueters personalizados como 'One Piece' y 'Toji', tela oversize. Míralos en nuestro catálogo.";
  }
  if (mensaje.includes("tote") || mensaje.includes("bolsa")) {
    return "Nuestras totebags vienen en varios estampados: BTS, Studio Ghibli, Nana Osaki, entre otros.";
  }
  if (mensaje.includes("envio") || mensaje.includes("envío") || mensaje.includes("domicilio")) {
    return "Para info de envíos, escríbenos por el formulario de contacto o nuestro Instagram @inkverse_ctg.";
  }
  if (mensaje.includes("contacto") || mensaje.includes("comprar") || mensaje.includes("pedido")) {
    return "Puedes hacer tu pedido llenando el formulario en nuestra página de Contacto, ¡con gusto te ayudamos!";
  }
  if (mensaje.includes("hola") || mensaje.includes("buenas")) {
    return "¡Hola! 👋 ¿En qué te puedo ayudar hoy?";
  }
  return "No entendí muy bien tu pregunta 🐰 Prueba preguntando sobre precios, productos o envíos.";
}
// ---------- CARRITO ----------
function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem("carrito")) || [];
  } catch (e) {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    const total = obtenerCarrito().reduce(function (suma, p) {
      return suma + p.cantidad;
    }, 0);
    contador.textContent = total;
  }
}

document.querySelectorAll(".btn-agregar").forEach(function (boton) {
  boton.addEventListener("click", function () {
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);
    const carrito = obtenerCarrito();

    const existente = carrito.find(function (p) {
      return p.nombre === nombre;
    });

    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    guardarCarrito(carrito);
  });
});

actualizarContador();
// ---------- PÁGINA DEL CARRITO ----------
function formatearPrecio(numero) {
  return "$" + numero.toLocaleString("es-CO");
}

function mostrarCarrito() {
  const lista = document.getElementById("carrito-lista");
  if (!lista) return; // si no estamos en carrito.html, no hace nada

  const carrito = obtenerCarrito();
  lista.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío 🐰</p>';
  }

  carrito.forEach(function (producto, indice) {
    const subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    lista.innerHTML += `
      <div class="carrito-item">
        <div class="carrito-info">
          <h3>${producto.nombre}</h3>
          <p>${formatearPrecio(producto.precio)} c/u</p>
        </div>
        <div class="carrito-cantidad">
          <button class="menos" data-indice="${indice}">−</button>
          <span>${producto.cantidad}</span>
          <button class="mas" data-indice="${indice}">+</button>
        </div>
        <div class="carrito-subtotal">${formatearPrecio(subtotal)}</div>
        <button class="quitar" data-indice="${indice}">✕</button>
      </div>
    `;
  });

  document.getElementById("carrito-total").textContent = formatearPrecio(total);
}

const listaCarrito = document.getElementById("carrito-lista");

if (listaCarrito) {
  listaCarrito.addEventListener("click", function (evento) {
    const carrito = obtenerCarrito();
    const indice = evento.target.dataset.indice;
    if (indice === undefined) return;

    if (evento.target.classList.contains("mas")) {
      carrito[indice].cantidad++;
    } else if (evento.target.classList.contains("menos")) {
      carrito[indice].cantidad--;
      if (carrito[indice].cantidad <= 0) carrito.splice(indice, 1);
    } else if (evento.target.classList.contains("quitar")) {
      carrito.splice(indice, 1);
    }

    guardarCarrito(carrito);
    mostrarCarrito();
  });

  document.getElementById("vaciar-carrito").addEventListener("click", function () {
    guardarCarrito([]);
    mostrarCarrito();
  });
}

mostrarCarrito();