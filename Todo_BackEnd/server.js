const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://rahulrajenderan96:rahulrajenderan96@cluster0.xrqprey.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    // Replace this with your user data retrieval logic (e.g., from a database)
    const user = { id: 1, username: "user", password: "1234" }; // Password: demo
  
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
  
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, "your-secret-key", {
        expiresIn: "1h", // expiration time 
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });
  
  // Protect routes with authentication middleware
  const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Access denied" });
    }
  
    jwt.verify(token, "your-secret-key", (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = user;
      next();
    });
  };

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
