
const sqlite3 = require('sqlite3').verbose();
   const db = new sqlite3.Database('./cats.db', (err) => {
       if (err) {
           console.error('Ошибка подключения к базе данных:', err.message);
       } else {
           console.log('Подключение к базе данных успешно.');
       }
   });

   db.serialize(() => {
    db.all(`SELECT * FROM cats`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row);
        });
    });
});

const insertCat = (name, age, breed, owner, img_link, rate, favourite, description) => {
    const sql = `INSERT INTO cats (name, age, breed, owner, img_link, rate, favourite, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [name, age, breed, owner, img_link, rate, favourite, description], function(err) {
        if (err) {
            return console.error('Ошибка вставки данных:', err.message);
        }
        console.log(`Кот с ID ${this.lastID} успешно добавлен.`);
    });
};





module.exports = db;

// const sqlite3 = require('sqlite3').verbose();
//    const db = new sqlite3.Database('./cats.db', (err) => {
//        if (err) {
//            console.error('Ошибка подключения к базе данных:', err.message);
//        } else {
//            console.log('Подключение к базе данных успешно.');
//            db.run(`CREATE TABLE IF NOT EXISTS cats (
//                id INTEGER PRIMARY KEY AUTOINCREMENT,
//                name TEXT NOT NULL,
//                age INTEGER,
//                breed TEXT,
//                owner TEXT,
//                img_link TEXT,
//                rate INTEGER,
//                favourite BOOLEAN,
//                description TEXT
//            )`, (err) => {
//                if (err) {
//                    console.error('Ошибка создания таблицы:', err.message);
//                } else {
//                    console.log('Таблица cats успешно создана.');
//                }
//            });
//        }
//    });