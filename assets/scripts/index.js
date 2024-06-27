const about = document.querySelector('.about')
const cards = document.querySelector('.cards')

const create_card = ({ name, role, pic }) => {
    const card = document.createElement('div')
    card.classList.add('card', 'hide')
    card.innerHTML = `
        <h2>${name}</h2>
        <div class="img-container">
            <img src="${pic}" alt="">
        </div>
        <p>${role}</p>
    `
    return card
}

about.innerText = ''
cards.innerHTML = ''

fetch_data().then((data) => {
    about.innerText = data.about

    data.committee.forEach(member => {
        cards.append(create_card(member))
    });
})

