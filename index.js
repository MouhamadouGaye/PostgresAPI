const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  try {
    const allDesc = await pool.query("SELECT * FROM todo;");
    res.json(allDesc.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allDesc = await pool.query("SELECT * FROM todo WHERE todo_id = $1;", [
      id,
    ]);
    res.json(allDesc.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo(description) VALUES($1);",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log;
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { description } = req.body;
    const { id } = req.params;
    const updateDesc = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("todo was updated");
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteDesc = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json("la description est supprimée!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3006, () => {
  console.log("server is running on port 3006");
});
