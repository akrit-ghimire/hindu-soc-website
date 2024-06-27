const DISMISSAL_CACHE_KEY = 'install_dismissal';
const DISMISSAL_CACHE_EXPIRY_TIME = 1000 * 3; // 3 sec

const create_banner = (callback_one, callback_two) => {
    const banner = document.createElement('div')
    banner.classList.add('banner', 'banner-lotus')
    banner.innerHTML = `
        <div class="content">
            <p>Stay up to date with upcoming events by downloading the Hindu Soc App!</p>
            <button class="cta" aria-label="click to install">Install</button>
        </div>
        <button class="icon" aria-label="click to close banner">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
    
    `
    const cta = banner.querySelector('.cta')
    const close = banner.querySelector('.icon')
 
    cta.onclick = callback_one
    close.onclick = callback_two

    return banner
}

const show_install_banner = (prompt) => {
    let banner

    const install = async () => {
        prompt.prompt()
        await prompt.userChoice
        banner.remove()
    }

    const close = () => {
        localStorage.setItem(`${DISMISSAL_CACHE_KEY}_timestamp`, Date.now())
        banner.remove()
    }


    banner = create_banner(install, close)
    document.body.insertBefore(banner, document.body.firstChild)
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()

    const install_dismissal = localStorage.getItem(`${DISMISSAL_CACHE_KEY}_timestamp`)

    if (install_dismissal && Date.now() - install_dismissal < DISMISSAL_CACHE_EXPIRY_TIME) return

    show_install_banner(e)
})
