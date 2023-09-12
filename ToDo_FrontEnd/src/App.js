import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (isLoggedIn) {
      axios.get("https://mern-todo-app-api-ow14.onrender.com/todos").then((res) => setTodos(res.data));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const addTodo = () => {
    axios.post("https://mern-todo-app-api-ow14.onrender.com/todos", { text: newTodo, completed: false }).then((res) => {
      setTodos([...todos, res.data]);
      setNewTodo("");
    });
  };

  const updateTodo = (id, text, completed) => {
    axios.put(`https://mern-todo-app-api-ow14.onrender.com/todos/${id}`, { text, completed }).then((res) => {
      const updatedTodos = todos.map((todo) =>
        todo._id === id ? res.data : todo
      );
      setTodos(updatedTodos);
    });
  };

  const deleteTodo = (id) => {
    axios.delete(`https://mern-todo-app-api-ow14.onrender.com/todos/${id}`).then(() => {
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      setTodos(updatedTodos);
    });
  };

  return (
    <div className="App">
      <h1>To-Do App</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) =>
                updateTodo(todo._id, todo.text, e.target.checked)
              }
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
