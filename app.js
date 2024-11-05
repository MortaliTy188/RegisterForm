const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
  // "mongodb+srv://test:2N97RKCRTAKv@users.eob8v.mongodb.net/?retryWrites=true&w=majority&appName=Users";
const client = new MongoClient(uri);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

async function connectToDB() {
  try {
    await client.connect();
    console.log("Подключение к MongoDB установлено");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
  }
}

connectToDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/sign_up", async function (req, res) {
  const { name, email, phone, password } = req.body;

  try {
    const db = client.db("users");
    const usersCollection = db.collection("users");

    const result = await usersCollection.insertOne({
      name,
      email,
      phone,
      password,
    });

    console.log("Запись успешно добавлена:", result.insertedId);
    res.status(200).json({ message: "Регистрация прошла успешно" });
  } catch (err) {
    console.error("Ошибка при вставке данных:", err);
    res.status(500).json({ error: "Ошибка при регистрации" });
  }
});

app.listen(port, function () {
  console.log(`Сервер запущен http://localhost:${port}`);
});
