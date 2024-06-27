fetch_data().then((data) => {
    const buymeacoffee = document.querySelector('.buymeacoffee')
    buymeacoffee.href = data.donate_link
    
    const email = document.querySelector('.email')
    email.innerHTML = `<p>${data.email}</p>`
    
    let copy_debounce = false
    const copy = document.querySelector('.copy')
    copy.onclick = () => {
        if (copy_debounce) return
        copy_debounce = true
    
        navigator.clipboard.writeText(data.email).then(() => {
            copy.innerHTML = "<p>copied</p>"
    
            setTimeout(() => {
                copy.innerHTML = "<p>copy</p>"
                copy_debounce = false
            }, 2000)
        }).catch(() => {
            copy.innerHTML = "<p>couldn't copy</p>"
    
            setTimeout(() => {
                copy.innerHTML = "<p>copy</p>"
                copy_debounce = false
            }, 2000)
        })
    }
})
