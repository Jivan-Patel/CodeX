const hamburger = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');
const icon = hamburger.querySelector('i');
const navItem = document.querySelector('nav-item');
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');

    if (navMenu.classList.contains('show')) {
        icon.classList.remove('ri-menu-line');
        icon.classList.add('ri-close-line');
    } else {
        icon.classList.remove('ri-close-line');
        icon.classList.add('ri-menu-line');
    }
});

//  navItem.addEventListener('click'){

//  }