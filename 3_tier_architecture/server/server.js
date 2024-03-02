const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("데이터베이스 연결 완료");
  const createTableQuery = `CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_note TEXT,
        deleted BOOLEAN NOT NULL DEFAULT FALSE
    )`;
  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Notes 데이터베이스에 Notes 테이블 생성");
  });
});

app.get("/", (req, res) => {
  res.json({ message: "서버 연결 완료" });
});

app.post("/notes", (req, res) => {
  const userMessage = req.body.content;
  console.log(`입력받은 내용 : ${userMessage}`);

  const sql = "INSERT INTO notes (user_note) VALUES (?)";
  const values = [userMessage];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("데이터베이스 저장 오류:", err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }
    const addedId = result.insertId;
    console.log("사용자 메모 데이터베이스에 저장 완료");
    res.json({
      message: "메모가 저장되었습니다",
      note: { id: addedId, user_note: userMessage },
    });
  });
});

app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes WHERE deleted = FALSE";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE notes SET deleted = TRUE WHERE id = ?";
  db.query(sql, id, (err, result) => {
    if (err) throw err;
    res.send(`Note with id ${id} deleted`);
  });
});

app.delete("/notes", (req, res) => {
  const sql = "UPDATE notes SET deleted = TRUE";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send("All notes deleted");
  });
});

const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
