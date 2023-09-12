const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { text, completed } = req.body;
  const todo = new Todo({ text, completed });
  await todo.save();
  res.json(todo);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const updatedTodo = await Todo.findByIdAndUpdate(id, { text, completed }, { new: true });
  res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
