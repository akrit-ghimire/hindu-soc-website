const express = require("express")
const cron = require('node-cron');
const app = express()
const webpush = require('web-push')
const cors = require("cors")
const port = 4000

const public = "BPq3FGcZuuoNOSmf_dI3kp6eIdIeTS-r2AEtteP1ImCQrM5ZkybsSs1FUzfijPhCroWjm2v0FEt9omfPhmCJ83k"
const private = "LWA34gMwEXj40XHdRkXaqylFaltHFFYc5meBy2YRCnE"

webpush.setVapidDetails(
    'mailto:edinburghhindusociety@gmail.com',
    public, 
    private
)

const allowedOrigins = ['http://localhost:3000']

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json())

app.get("/", (req, res) => {
    res.send("hello world")
})

const sub_db = []
app.post("/save-subscription", (req, res) => {
    const exists = sub_db.some(sub => sub.endpoint === req.body.endpoint)
    
    if (!exists) {
        sub_db.push(req.body)
        res.json({ status: "success" })

    } else res.json({ status: "already subbed" })
})

const send_reminders = () => {
    sub_db.forEach(sub => {
        webpush.sendNotification(sub, "remind").catch(error => {
            console.error('Error sending notification for reminder');
        })
    })
}

const send_check_new = () => {
    sub_db.forEach(sub => {
        webpush.sendNotification(sub, "new").catch(error => {
            console.error('Error sending notification for check new');
        })
    })
}

cron.schedule('0 8 * * *', () => {
    console.log('Sending reminder at 8 AM everyday');
    send_reminders();
})

cron.schedule('0 13 * * 1,5', () => {
    console.log('Sending new event reminder at 1 PM every Monday & Friday');
    send_check_new();
})

app.listen(port, () => {
    console.log('server running on 4000')
})