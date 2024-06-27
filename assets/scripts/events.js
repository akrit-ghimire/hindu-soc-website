const get_suffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}
const reformat_date = (gmt_string) => {
    const date = new Date(gmt_string);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const weekday = days[date.getUTCDay()];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    let hour = date.getUTCHours();

    const period = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12

    const suffix = get_suffix(day);

    const formattedDate = `${weekday} ${day}${suffix} ${month} @ ${hour}${period}`;
    return formattedDate;
}

const events = document.querySelector('.events')
const events_heading = document.querySelector('.events-heading')

const create_event = async ({ name, date, desc }) => {
    const event = document.createElement('div')
    event.classList.add('event')
    event.innerHTML = `
        <div class="content">
            <h2>${name}</h2>
            <p>${reformat_date(date)}</p>
        </div>
        <div class="details hidden">
            <p>${desc}</p>
        </div>
        <div class="buttons">
            <div class="button details-btn btn-dark">
                Details 
            </div>
            <div class="button remind-btn ${await is_reminding(name, date) || happening_today(date) ? 'btn-light' : 'btn-darkest'}">
                ${happening_today(date) ? 'Event Today' : await is_reminding(name, date) ? 'Will Remind' : 'Remind Me'}
            </div>
        </div>
    `
    const details = event.querySelector('.details')
    const show_details_btn = event.querySelector('.details-btn')
    show_details_btn.onclick = () => {
        if (details.classList.contains('hidden')) {
            details.classList.remove('hidden')
            show_details_btn.innerText = "Show Less"
            show_details_btn.classList.remove('btn-dark') 
            show_details_btn.classList.add('btn-light') 
            return
        }

        details.classList.add('hidden')
        show_details_btn.innerText = "Details"
        show_details_btn.classList.add('btn-dark') 
        show_details_btn.classList.remove('btn-light') 
    }

    const remind = event.querySelector('.remind-btn')
    remind.onclick = async () => {
        if (happening_today(date)) return

        if (await is_reminding(name, date)) {
            await remove_reminder(name, date)
            remind.classList.add('btn-darkest')
            remind.classList.remove('btn-light')
            remind.innerText = 'Remind Me'
        } else {
            const success = await set_reminder(name, date, desc)
            if (!success) return
            
            remind.classList.remove('btn-darkest')
            remind.classList.add('btn-light')
            remind.innerText = 'Will Remind'
        }
    }

    return event
}

events.innerHTML = ''
events_heading.innerText = 'Fetching Events...'

fetch_events().then((events_data) => {
    if (events_data.length > 0) {
        events_heading.innerText = 'Upcoming Events'
        events_data.forEach(async event => {
            events.append(await create_event(event))
        })
    } else events_heading.innerText = 'No Upcoming Events'
})