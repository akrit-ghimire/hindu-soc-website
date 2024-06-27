const modal = async (title, text, callback, buttons = true, type = 'modal-cyan') => new Promise((resolve, reject) => {
    const modal_container = document.createElement('modal_elem')
    modal_container.classList.add('modal-container')
    modal_container.innerHTML = `
        <div class="modal ${type}">
            <h2>${title}</h2>
            <p>${text}</p>
            <div class="buttons">
                <button class="close ${buttons ? 'hidden' : ''}">Close</button>
                <button class="no ${!buttons ? 'hidden' : ''}">Cancel</button>
                <button class="yes ${!buttons ? 'hidden' : ''}">Accept</button>
            </div>
        </div>
    `
    const no = modal_container.querySelector('.no')
    const close = modal_container.querySelector('.close')
    const yes = modal_container.querySelector('.yes')

    no.onclick = () => { 
        modal_container.remove()
        resolve(false)
    }
    close.onclick = () => { 
        modal_container.remove()
        resolve(false)
    }
    yes.onclick = async () => {
        yes.disabled = true
        await callback()
        modal_container.remove()
        resolve(true)
    }

    document.body.insertBefore(modal_container, document.body.firstChild)
})

const ask_notification_perms = async () => {
    if (Notification.permission == 'granted') return true

    if (Notification.permission == 'denied') {
        await modal(
            "Notification Permission Denied",
            "You need to enable notifcation permissions manually to access this feature.",
            null,
            false
        )
        return false
    }

    await modal(
        "Notification Permission Needed",
        "To send you a reminder of this event, you need to allow notification permissions.",
        async () => {
            await Notification.requestPermission()
        }
    )
        
    const permission = Notification.permission
        
    if (permission == 'granted') {
        await subscribe()
        return true
    }
    
    return false
}

const notify = async (title, text = '', ask_perms = false) => {
    if (Notification.permission !== "granted") {
        if (!ask_perms) return

        const perm = await ask_notification_perms()
        if (!perm) return
    }

    // when called this is literally service worker
    self.registration.active.postMessage({
        type: 'notify',
        payload: { title, text }
    })
}