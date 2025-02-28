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

app.get('/cats/:id', (req, res) => {
    const catId = req.params.id;

    // SQL-запрос для получения информации о коте
    const getCatSql = `SELECT * FROM cats WHERE id = ?`;

    db.get(getCatSql, [catId], (err, row) => {
        if (err) {
            console.error('Ошибка при получении кота:', err.message);
            return res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
        }

        if (!row) {
            return res.status(404).json({ message: 'Кот не найден.' });
        }

        // // Получение количества лайков для кота
        // const getLikesCountSql = `SELECT COUNT(*) as likesCount FROM likes WHERE catId = ?`;
        // db.get(getLikesCountSql, [catId], (err, likesRow) => {
        //     if (err) {
        //         console.error('Ошибка при получении количества лайков:', err.message);
        //         return res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
        //     }

            // Формирование ответа
            const response = {
                id: row.id,
                name: row.name,
                age: row.age,
                breed: row.breed,
                img_link: row.img_link,
                description: row.description
            };

            res.json(response);
        });
    });
// });

// app.post('/cats/:id/like', (req, res) => {
//     const catId = req.params.id;

//     // Проверка существования лайка
//     const checkLikeSql = `SELECT * FROM likes WHERE catId = ?`;
//     db.get(checkLikeSql, [catId], (err, row) => {
//         if (err) {
//             console.error('Ошибка при проверке лайка:', err.message);
//             return res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
//         }

//         if (row) {
//             // Лайк уже существует
//             return res.status(400).json({ message: 'Вы уже поставили лайк этому котику.' });
//         }

//         // Добавление нового лайка
//         const insertLikeSql = `INSERT INTO likes catId VALUES = ?`;
//         db.run(insertLikeSql, [catId], function(err) {
//             if (err) {
//                 console.error('Ошибка вставки лайка:', err.message);
//                 return res.status(500).json({ message: 'Ошибка сервера. Попробуйте позже.' });
//             }
//             res.status(201).json({ message: 'Лайк успешно добавлен.' });
//         });
//     });
// });




// Запуск сервера


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});