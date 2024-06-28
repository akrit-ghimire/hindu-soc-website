const API_KEY = 'AIzaSyBrPtGjta1zxlx_orW-8l7RwoYa_S0Umnc';
const SHEET_ID = '17BIvdQv4fxlrJmkjEGXIEsubDEQEBN06Z3VJ3HrWnBY';
const CACHE_KEY = 'socials_section';
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
        const cached_socials_section = localStorage.getItem(CACHE_KEY)
        const cached_timestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`)

        if (cached_socials_section && cached_timestamp && Date.now() - cached_timestamp < CACHE_EXPIRY_TIME) {
            resolve(JSON.parse(cached_socials_section))
        
        } else {
            const socials_results = await fetch_sheet('SOCIALS')

            if (!socials_results.ok) reject([])

            const raw_socials = socials_results.payload.values.splice(1)
            const socials = []

            raw_socials.forEach(profile => {
                if (profile.length !== 3) return
                if (!profile[0]) return

                socials.push({
                    name: profile[0],
                    link: profile[1],
                    pic: profile[2],
                })
            })

            // set in cache
            localStorage.setItem(CACHE_KEY, JSON.stringify(socials))
            localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now())

            resolve(socials)
        }
    })
}