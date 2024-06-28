const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    })
})
const start_observer = () => {
    const hidden_elements = document.querySelectorAll('.hide')
    hidden_elements.forEach(el => observer.observe(el))
}