const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "register",
  password: "123123",
  port: 5432,
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.post("/sign_up", function (req, res) {
  let { name, email, phone, password } = req.body;

  let insertQuery = `
    INSERT INTO users (name, email, phone, password) 
    VALUES ($1, $2, $3, $4)
  `;

  pool.query(insertQuery, [name, email, phone, password], (err, result) => {
    if (err) {
      console.error("Ошибка при вставке данных:", err);
      res.status(500).json({ error: "Ошибка при регистрации" });
    } else {
      console.log("Запись успешно добавлена");
      res.status(200).json({ message: "Регистрация прошла успешно" });
    }
  });
});

app.listen(3000, function () {
  console.log(`сервер запущен http://localhost:${port}`);
});
