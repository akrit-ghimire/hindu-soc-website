const API_KEY = 'AIzaSyBrPtGjta1zxlx_orW-8l7RwoYa_S0Umnc';
const SHEET_ID = '17BIvdQv4fxlrJmkjEGXIEsubDEQEBN06Z3VJ3HrWnBY';
const CACHE_KEY = 'about_section';
const CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 24 * 3; // 3 days

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
        const cached_about_section = localStorage.getItem(CACHE_KEY)
        const cached_timestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`)

        if (cached_about_section && cached_timestamp && Date.now() - cached_timestamp < CACHE_EXPIRY_TIME) {
            resolve(JSON.parse(cached_about_section))
        
        } else {
            const about_results = await fetch_sheet('ABOUT')
            const committee_results = await fetch_sheet('COMMITTEE')

            if (!about_results.ok || !committee_results.ok) reject({})

            const about = about_results.payload.values[1][0] // values list index 1

            const raw_committee = committee_results.payload.values.splice(1)
            const committee = []

            raw_committee.forEach(member => {
                if (member.length !== 3) return
                if (!member[0]) return

                committee.push({
                    name: member[0],
                    role: member[1],
                    pic: member[2],
                })
            })

            const data = { about, committee }

            // set in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(data))
            localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now())

            resolve(data)
        }
    })
}