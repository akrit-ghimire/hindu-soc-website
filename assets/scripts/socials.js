const socials = document.querySelector('.socials')

const create_social = ({ name, pic, link }) => {
    const social = document.createElement('a')
    social.classList.add('social')
    social.innerHTML = `
        <img src="${pic}" alt="">
        <h2>${name}</h2>
    `
    social.href = link 
    social.ariaLabel = `click to go to our ${name} profile`
    social.target = "_blank"
    return social
}

socials.innerHTML = ''

fetch_data().then((profiles) => {
    profiles.forEach(profile => {
        socials.append(create_social(profile))
    })
})
