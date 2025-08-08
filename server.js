const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', async (req, res) => {
    const data = req.body.Content;
    const url = req.body.Url;

    if (typeof data !== 'object' || !data.content || typeof url !== 'string') {
        return res.status(400).send({ error: 'Invalid Content or Url' });
    }

    if (data.content.length > 2000) {
        return res.status(400).send({ error: 'Content too long (max 2000 chars)' });
    }

    try {
        const response = await axios.post(`https://discord.com/api/webhooks/${url}`, data);
        res.status(response.status).send(response.data);
    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data || 'Unknown error';
        res.status(status).send({ error: message });
    }
});

app.get('/', (req, res) => {
    res.send("Discord Webhook Proxy ready.");
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
