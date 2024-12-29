
// Inicializar el menú móvil
document.addEventListener('DOMContentLoaded', function () {
    const sidenav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sidenav);

    const toggleDarkModeButton = document.querySelector('.toggleDarkMode');


    toggleDarkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        toggleDarkModeButton.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Oscuro';
    });
});



