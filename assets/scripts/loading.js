const images = document.querySelectorAll('img')
const loading_screen = document.querySelector('.loading')

let loaded = 0

const is_all_images_loaded = () => {
    loaded++
    if (loaded === images.length) {
        loading_screen.classList.add('loading-hide')
        setTimeout(() => {
            loading_screen.remove()
        }, 1000)
    }
}

images.forEach((img) => {
    if (img.complete) is_all_images_loaded()
    else {
        img.addEventListener('load', is_all_images_loaded)
        img.addEventListener('error', is_all_images_loaded)
    }
})