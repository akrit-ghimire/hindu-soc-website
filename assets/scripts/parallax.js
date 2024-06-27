const parallaxElements = [];
const parallaxi = document.querySelectorAll('[data-parallax]');
parallaxi.forEach(elem => {
    parallaxElements.push({
        elem,
        speed: parseFloat(elem.dataset.speed) || 0.5,
        move: elem.dataset.leftToRight ? 'l-to-r': null
    });
    
    // Ensure hardware acceleration
    elem.style.willChange = 'transform';
});

let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    parallaxElements.forEach(parallax => {
        const offsetY = lastScrollY * parallax.speed;
        const offsetX = parallax.move == 'l-to-r' ? -50 + lastScrollY * .005 : -50
        parallax.elem.style.transform = `translate3d(${offsetX}%, ${offsetY}px, 0)`;  // Ensure GPU acceleration
    });
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (lastScrollY < 1000) updateParallax()
})
