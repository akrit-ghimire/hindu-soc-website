
const sample_data = { key: 'chai and chats-thrusday 25th may', title: 'chai and chats', date: 'thursday 25th may' }

let db
const db_request = indexedDB.open("WebAppDB", 2)

db_request.onerror = (e) => { console.log('Error opening database: ', e) }
db_request.onsuccess = (e) => { db = e.target.result }
db_request.onupgradeneeded = (e) => {
    let db = e.target.result
    if (!db.objectStoreNames.contains('reminders')) db.createObjectStore('reminders', {keyPath: 'key'})
    if (!db.objectStoreNames.contains('storage')) db.createObjectStore('storage', {keyPath: 'name'})
}

const db_add = (obj, table) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readwrite")
    const obj_store = transaction.objectStore(table)

    transaction.oncomplete = () => { resolve(true) }
    transaction.onerror = () => { resolve(false) }

    const request = obj_store.add(obj)
    request.onsuccess = () => { resolve(true) }
    request.onerror = () => { resolve(false) }
})

const db_update = (obj, table) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readwrite")
    const obj_store = transaction.objectStore(table)

    transaction.oncomplete = () => { resolve(true) }
    transaction.onerror = () => { resolve(false) }

    const request = obj_store.put(obj)
    request.onerror = () => { resolve(false) }
    request.onsuccess = () => { resolve(true) }
})


const db_delete = (key, table) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readwrite")
    const obj_store = transaction.objectStore(table)

    transaction.oncomplete = () => { resolve(true) }
    transaction.onerror = () => { resolve(false) }

    const request = obj_store.delete(key)
    request.onerror = () => { resolve(false) }
    request.onsuccess = () => { resolve(true) }
})

const db_get = (key, table) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readonly");
    const obj_store = transaction.objectStore(table);

    const request = obj_store.get(key);
    request.onsuccess = (e) => { resolve(e.target.result) }
    request.onerror = (e) => { resolve(null) }
})

const db_get_all = (table) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table], "readonly")
    const obj_store = transaction.objectStore(table)

    const request = obj_store.getAll()
    request.onsuccess = (e) => { resolve(e.target.result) }
    request.onerror = (e) => { resolve([]) }
})

const is_reminding = async (name, date) => {
    const reminder = await db_get(name + '-' + date, 'reminders')
    
    if (reminder) return true
    return false
}
const set_reminder = async (name, date, desc) => {
    const perms = await ask_notification_perms()
    
    if (!perms) return false
    
    const new_reminder = {
        key: name + '-' + date,
        name, date, desc
    }

    await db_add(new_reminder, 'reminders')
    return true // this is to say perm was available
}
const remove_reminder = async (name, date) => {
    await db_delete(name + '-' + date, 'reminders')
}

const happening_today = (date_string, compare_to = null) => {
    const now = new Date(Date.now()).toDateString()
    const date = new Date(date_string).toDateString()
    if (compare_to) return compare_to == date
    return now == date
}

const remind = async () => {
    const reminders = await db_get_all('reminders')

    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i];
        const date = reminder.date 
    
        console.warn('hardcoded val here')
        if (!happening_today(date, "Thu Jul 04 2024")) continue
    
        notify(`${reminder.name} is happening today!`, reminder.desc)
        await db_delete(reminder.key, 'reminders')
    }
}