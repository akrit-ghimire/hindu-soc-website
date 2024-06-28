const API_KEY = 'AIzaSyBrPtGjta1zxlx_orW-8l7RwoYa_S0Umnc';
const CALENDAR_ID = '16732179e20e5db2e61d0e63eed66643aec505b1c7ec8e5bce0b72744a68b898@group.calendar.google.com';
const MAX_RESULTS = 3;
const CACHE_KEY = 'upcoming_events';
const CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 12; // 12 hr

const fetch_calendar_events = async () => {
    try {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&maxResults=${MAX_RESULTS}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`);

        if (response.ok) {
            const data = await response.json();
            return { ok: true, payload: data };
        } else {
            return { ok: false, payload: 'FAILED' };
        }

    } catch (error) {
        return { ok: false, payload: 'NETWORK' };
    }
}

const reformat = (fetch_results) => {
    if (!fetch_results) return []
    
    const raw_events = fetch_results.items
    const cleaned_events = []

    raw_events.forEach(event => {
        cleaned_events.push({
            name: event.summary,
            date: event.start.dateTime,
            desc: event.description,
            key: event.summary + '-' + event.start.dateTime
        })
    })

    return cleaned_events
}

const fetch_events = () => {
    return new Promise(async (resolve, reject) => {
        // get from cache
        const events = await db_get('events', 'storage')

        if (events && Date.now() - events.timestamp < CACHE_EXPIRY_TIME) {
            resolve(events.data)
        
        } else {
            const fetch_results = await fetch_calendar_events()
            if (fetch_results.ok) {
                const events_data = reformat(fetch_results.payload)

                await db_update({
                    name: 'events',
                    data: events_data,
                    timestamp: Date.now()
                }, 'storage')

                resolve(events_data)
            }
            else reject([])
        }
    })
}

const new_event = async () => {
    const client_req = await db_get('events', 'storage')
    if (!client_req) return 

    const client_events = client_req.data
    
    const req = await fetch_calendar_events()
    if (!req.ok) return // bad request

    const server_events = reformat(req.payload)

    if (client_events[0].key == server_events[0].key) 

    await db_update({ // update db with the new events list
        name: 'events',
        data: server_events,
        timestamp: Date.now()
    }, 'storage')

    const text = happening_today(server_events[0].date) ? `${server_events[0].name} is happening today!` : `New upcoming event: ${server_events[0].name}!`
    
    notify(text, server_events[0].desc)
}
