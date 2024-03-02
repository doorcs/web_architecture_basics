const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let newId = 2;
let dbnotes = [
  { id: 0, user_note: "Sample Memo Data 1" },
  { id: 1, user_note: "Sample Memo Data 2" },
];

app.get("/", (req, res) => {
  res.json({ message: "서버 연결 완료" });
});

app.post("/notes", (req, res) => {
  const userMessage = req.body.content;
  const newNote = { id: newId++, user_note: userMessage };
  dbnotes.push(newNote);
  res.json({ message: "메모가 저장되었습니다", note: newNote });
});

app.get("/notes", (req, res) => {
  const activeNotes = dbnotes.filter(note => !note.deleted);
  res.json(activeNotes);
});

app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  dbnotes = dbnotes.map(note => note.id !== id ? note : { ...note, deleted: true });
  res.send(`Note with id ${id} deleted`);
});

app.delete("/notes", (req, res) => {
  dbnotes = dbnotes.map(note => ({ ...note, deleted: true }));
  res.send("All notes deleted");
});

const port = 80;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
