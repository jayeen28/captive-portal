const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const db = require('./db');

const app = express();
const PORT = 8080;

const CAPTIVE_PATHNAMES = [
    "/generate_204",
    "/connecttest.txt",
    "/check_network_status.txt",
    "/ncsi.txt",
    "/"
];

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/captive', async (req, res) => {

    try {
        res.send(`
        <form method="POST" action="/submit">
            <label>Facebook URL:</label>
            <input type="url" name="fburl" required>
                <button type="submit">Submit</button>
        </form>
            `);
    }
    catch (e) {
        console.log(e);
        res.status(200).send('Something went wrong!!'); //The response status must be 200 otherwise the message will not appear on the html viewer application in andriod.
    }
});

app.use(async (req, res, next) => {
    const url = req.originalUrl;
    const isCap = CAPTIVE_PATHNAMES.some(path => url === path);
    console.log(url, isCap);
    if (isCap) res.redirect('/captive');
    else next();
});

app.post('/submit', async (req, res) => {
    try {
        const fburl = req.body.fburl;

        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(':').pop();

        const mac = await new Promise((res, rej) => {
            exec(`arp -n ${ip}`, (err, stdout) => {
                if (err) return console.error(err);
                const match = stdout.match(/..:..:..:..:..:../);
                const mac = match[0];
                if (mac) res(mac);
                else rej('Mac address not found')
            });
        });

        console.log(`Allowing access to: ${ip}, Facebook: ${fburl}`);

        // Allow internet access for this mac
        exec(`sudo iptables -I FORWARD -m mac --mac-source ${mac} -j ACCEPT`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error allowing MAC: ${stderr}`);
                return res.status(500).send("Failed to allow access.");
            }

            return res.status(200).send(`<p>Thank you! Internet access granted. You may now use the internet.</p>`);
        });
    }
    catch (e) {
        console.log(e);
        return res.status(200).send('Something went wrong !!')
    }
});

async function main() {
    await db();
    console.log('Database ready');
    app.listen(PORT, () => {
        console.log(`Captive portal running on port ${PORT}`);
    });

}

main();
