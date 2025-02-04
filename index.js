const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Получить список всех котов
app.get('/cats', (req, res) => {
    db.all("SELECT * FROM cats", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Создать нового кота

app.post('/cats', (req, res) => {
    const { name, age, breed, owner, img_link, rate, favourite, description } = req.body;
    db.run("INSERT INTO cats (name, age, breed, owner, img_link, rate, favourite, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name, age, breed, owner, img_link, rate, favourite, description], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, age, breed, owner, img_link, rate, favourite, description });
    });
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});