let sideNav = document.getElementById('sideNav');

let openMenuBtn = document.getElementById('openMenuBtn');
let closeMenuBtn = document.getElementById('closeMenuBtn');

openMenuBtn.addEventListener('click', () => {
    sideNav.style.right = '0px';
});

closeMenuBtn.addEventListener('click', () => {
    sideNav.style.right = '-350px';
});