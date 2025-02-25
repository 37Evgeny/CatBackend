const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Разрешаем запросы со всех источников
app.use(cors({
    origin: '*', // Разрешите все источники, при необходимости измените на конкретные
}));

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

// Удалить котика

app.delete('/cats/:id', (req, res) => {
    const { id } = req.params; // Получаем id из параметров URL
    db.run("DELETE FROM cats WHERE id = ?", id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            // Если не было удалено ни одной строки (нет котика с таким ID)
            res.status(404).json({ message: 'Котик не найден' });
            return;
        }
        res.status(204).send(); // Успешное удаление, отправляем пустой ответ
    });
});

app.post('/cats/:id/like', (req, res) => {
    const catId = req.params.id;
    const userId = req.user.id; // ID аутентифицированного пользователя
    // Логика для добавления лайка в базу данных
});

app.delete('/cats/:id/like', (req, res) => {
    const catId = req.params.id;
    const userId = req.user.id; // ID аутентифицированного пользователя
    // Логика для удаления лайка из базы данных
});



// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});