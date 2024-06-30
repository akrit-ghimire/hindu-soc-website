const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    })
})
let observer_started = false
const start_observer = () => {
    if (observer_started) return 
    observer_started = true
    const hidden_elements = document.querySelectorAll('.hide')
    hidden_elements.forEach(el => observer.observe(el))
}
start_observer()