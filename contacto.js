import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAeKyvHAVt_T-YKqofnwaF9Si9uL0UHx-g",
  authDomain: "inkverse-3a4c0.firebaseapp.com",
  projectId: "inkverse-3a4c0",
  storageBucket: "inkverse-3a4c0.firebasestorage.app",
  messagingSenderId: "696243065864",
  appId: "1:696243065864:web:251c7adbdf9d618f3cadbd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("form-contacto");
const aviso = document.getElementById("aviso-form");

form.addEventListener("submit", async function (evento) {
  evento.preventDefault(); // evita que la página se recargue

  const datos = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    telefono: document.getElementById("telefono").value,
    producto: document.getElementById("producto").value,
    mensaje: document.getElementById("mensaje").value
  };

  aviso.textContent = "Enviando...";

  try {
    // 1. Guarda el mensaje en la base de datos
    await addDoc(collection(db, "mensajes"), {
      ...datos,
      fecha: serverTimestamp()
    });

    // 2. Manda una copia por Formspree (si falla, no pasa nada)
    fetch("https://formspree.io/f/xppwobvy", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    }).catch(function () {});

    form.reset();
    aviso.textContent = "¡Mensaje enviado! Te responderemos pronto 🐰";
  } catch (error) {
    console.error(error);
    aviso.textContent = "Ups, algo salió mal. Intenta de nuevo o escríbenos por Instagram.";
  }
});