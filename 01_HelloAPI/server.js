const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my backend journey!' 
    });
});

app.get('/about', (req, res) => {
    res.json({ project: "backend projects",
        author: "Aryan Chaudhary"
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK',
        uptime: process.uptime()
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});