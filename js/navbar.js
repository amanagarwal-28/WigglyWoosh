// This file handles the navigation bar functionality, including mobile responsiveness.

document.addEventListener('DOMContentLoaded', function() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', function() {
        navbarMenu.classList.toggle('is-active');
        navbarToggle.classList.toggle('is-active');
    });

    // Close the navbar when a link is clicked
    const navbarLinks = document.querySelectorAll('.navbar-menu a');
    navbarLinks.forEach(link => {
        link.addEventListener('click', function() {
            navbarMenu.classList.remove('is-active');
            navbarToggle.classList.remove('is-active');
        });
    });
});