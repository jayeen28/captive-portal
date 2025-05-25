const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send(`
    <form method="POST" action="/submit">
      <label>Facebook URL:</label>
      <input type="url" name="fburl" required>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.use((req, res) => {
    res.redirect('/');
});

app.post('/submit', (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const fburl = req.body.fburl;

    console.log(`Allowing access to: ${ip}, Facebook: ${fburl}`);

    // Allow internet access for this IP
    exec(`iptables -I FORWARD -s ${ip} -j ACCEPT`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error allowing IP: ${stderr}`);
            res.status(500).send("Failed to allow access.");
            return;
        }
        res.send(`<p>Thank you! Internet access granted. You may now use the internet.</p>`);
    });
});

app.listen(PORT, () => {
    console.log(`Captive portal running on port ${PORT}`);
});
