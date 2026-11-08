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

// Quita tildes y mayúsculas para entender mejor lo que escriben
function limpiarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Cada tema tiene palabras clave (SIN tildes) y una respuesta
const temas = [
  {
    palabras: ["hola", "buenas", "buenos dias", "hey"],
    respuesta: "¡Hola! 👋 Soy Inkbot. Pregúntame por precios, tallas, productos, cuidados o cómo pedir."
  },
  {
    palabras: ["precio", "cuesta", "vale", "cuanto", "costo", "valor"],
    respuesta: "Los sueters cuestan $50.000 COP, el Tote Grande $30.000, el Tote Edición Nana $40.000 y el llavero de fresa $5.000 COP."
  },
  {
    palabras: ["catalogo", "productos", "que venden", "que tienen", "que ofrecen"],
    respuesta: "Tenemos sueters, totebags y accesorios (llaveros). Míralos todos en la página de Catálogo 🛍️"
  },
  {
    palabras: ["sueter", "camiseta", "buso", "oversize"],
    respuesta: "Nuestros sueters, como One Piece y Toji, son oversize y cuestan $50.000 COP. Hay tallas S, M, L y XL."
  },
  {
    palabras: ["talla", "medida", "tamano", "size"],
    respuesta: "Medidas (ancho x largo): S 51x67, M 52x68, L 56x73, XL 58x77. Los totebags miden 35x40."
  },
  {
    palabras: ["tote", "totebag", "bolsa", "bolso"],
    respuesta: "El Tote Grande cuesta $30.000 COP y tiene estampados de BTS, Studio Ghibli y Nana Osaki. Mide 35x40."
  },
  {
    palabras: ["nana", "hachi", "edicion especial"],
    respuesta: "El Tote Edición Especial Nana cuesta $40.000 COP, tiene diseño en dos caras (Nana & Hachi) e incluye llavero y bolsita protectora."
  },
  {
    palabras: ["llavero", "fresa", "accesorio"],
    respuesta: "El llavero de fresa cuesta $5.000 COP. Viene en negro o fucsia e incluye bolsita protectora."
  },
  {
    palabras: ["lavar", "lavado", "cuidado", "cuidar"],
    respuesta: "Nuestra recomendación es lavar las prendas a mano para que el estampado dure más 🧼"
  },
  {
    palabras: ["personalizar", "personalizado", "personalizada", "mi diseno", "estampar", "dibujo"],
    respuesta: "¡Sí, hacemos prendas personalizadas! Cuéntanos tu idea en la página de Contacto y te respondemos pronto 🎨"
  },
  {
    palabras: ["comprar", "pedido", "pedir", "carrito", "ordenar"],
    respuesta: "Agrega tus prendas al carrito en el Catálogo y dale a 'Pedir por WhatsApp'. Ahí confirmamos tu pedido 🛒"
  },
  {
    palabras: ["pagar", "pago", "transferencia", "tarjeta", "efectivo"],
    respuesta: "El pago lo acordamos por WhatsApp cuando envíes tu pedido desde el carrito."
  },
  {
    palabras: ["envio", "domicilio", "entrega", "despacho", "cuanto demora"],
    respuesta: "Para envíos y tiempos de entrega, escríbenos por WhatsApp o Instagram @inkverse_ctg y te confirmamos 📦"
  },
  {
    palabras: ["instagram", "contacto", "whatsapp", "redes", "escribir", "hablar"],
    respuesta: "Nos encuentras en Instagram como @inkverse_ctg, o escríbenos desde la página de Contacto 💬"
  },
  {
    palabras: ["gracias", "chao", "adios", "hasta luego"],
    respuesta: "¡Gracias a ti! 🐰 Aquí estaré si necesitas algo más."
  }
];

function generarRespuesta(mensaje) {
  const texto = limpiarTexto(mensaje);
  let mejorTema = null;
  let mejorPuntos = 0;

  // Cuenta cuántas palabras clave de cada tema aparecen en el mensaje
  temas.forEach(function (tema) {
    let puntos = 0;
    tema.palabras.forEach(function (palabra) {
      if (texto.includes(palabra)) puntos++;
    });
    if (puntos > mejorPuntos) {
      mejorPuntos = puntos;
      mejorTema = tema;
    }
  });

  if (mejorTema) return mejorTema.respuesta;

  return "No estoy seguro de eso 🐰 Escríbenos por Instagram @inkverse_ctg o por la página de Contacto y te ayudamos.";
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
// ---------- PEDIDO POR WHATSAPP ----------
const btnWhatsapp = document.getElementById("pedir-whatsapp");

if (btnWhatsapp) {
  btnWhatsapp.addEventListener("click", function () {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      alert("Tu carrito está vacío. Agrega una prenda primero 🐰");
      return;
    }

    let mensaje = "¡Hola Inkverse! 🐰 Quiero hacer este pedido:\n\n";
    let total = 0;

    carrito.forEach(function (producto) {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;
      mensaje += "• " + producto.cantidad + " x " + producto.nombre + " - " + formatearPrecio(subtotal) + "\n";
    });

    mensaje += "\nTotal: " + formatearPrecio(total);

    const numero = "573054083004"; // <-- AQUÍ VA TU NÚMERO
    const url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
  });
}
// ---------- BOTONES DE PREGUNTAS RÁPIDAS ----------
const preguntasRapidas = ["Precios", "Tallas", "Cómo pedir", "Envíos", "Personalizar"];

if (caja) {
  const contenedorRapidas = document.createElement("div");
  contenedorRapidas.className = "chat-rapidas";

  preguntasRapidas.forEach(function (pregunta) {
    const boton = document.createElement("button");
    boton.textContent = pregunta;

    boton.addEventListener("click", function () {
      agregarMensaje(pregunta, "usuario");
      const respuesta = generarRespuesta(pregunta);
      setTimeout(function () {
        agregarMensaje(respuesta, "bot");
      }, 500);
    });

    contenedorRapidas.appendChild(boton);
  });

  // Los pone justo encima de la cajita donde se escribe
  caja.insertBefore(contenedorRapidas, caja.querySelector(".chat-input-area"));
}