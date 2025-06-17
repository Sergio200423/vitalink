// main/static/main/register.js
// Guarda usuario y contraseña en sessionStorage al registrar
function handleRegisterSubmit(event) {
    event.preventDefault();
    const username = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    // Guardar en sessionStorage (solo para demo, no seguro en producción)
    sessionStorage.setItem('demo_username', username);
    sessionStorage.setItem('demo_password', password);
    // Redirigir a login o mostrar mensaje
    window.location.href = '/inicioSesion';
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.onsubmit = handleRegisterSubmit;
    }
});
