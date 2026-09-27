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