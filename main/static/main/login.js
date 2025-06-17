// main/static/main/login.js
// Valida usuario y contraseña usando sessionStorage (solo demo)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.onsubmit = function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const storedUser = sessionStorage.getItem('demo_username');
            const storedPass = sessionStorage.getItem('demo_password');
            if (username === storedUser && password === storedPass) {
                alert('¡Login exitoso!');
                // Redirige al inicio de la app herramientas
                window.location.href = '/herramientas/';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        }
    }
});
