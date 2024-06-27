const API_KEY = 'AIzaSyBrPtGjta1zxlx_orW-8l7RwoYa_S0Umnc';
const SHEET_ID = '17BIvdQv4fxlrJmkjEGXIEsubDEQEBN06Z3VJ3HrWnBY';
const CACHE_KEY = 'contact_section';
const CACHE_EXPIRY_TIME = 1000 * 60 * 60; // 1 hr

const fetch_sheet = async (sheet) => {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheet}?key=${API_KEY}`);

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

const fetch_data = () => {
    return new Promise(async (resolve, reject) => {
        // get cache
        const cached_contact_section = localStorage.getItem(CACHE_KEY)
        const cached_timestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`)

        if (cached_contact_section && cached_timestamp && Date.now() - cached_timestamp < CACHE_EXPIRY_TIME) {
            resolve(JSON.parse(cached_contact_section))
        
        } else {
            const contact_results = await fetch_sheet('CONTACT')

            if (!contact_results.ok) reject({})

            const raw_contact = contact_results.payload.values.splice(1)[0]
            
            const data = {
                email: raw_contact[0],
                donate_link: raw_contact[1],
            }

            // set in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data))
            localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now())

            resolve(data)
        }
    })
}