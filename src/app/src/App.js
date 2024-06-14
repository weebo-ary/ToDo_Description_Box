import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/todos/");
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      } else {
        console.error("Failed to fetch todos:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/todos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      if (response.ok) {
        setNewTodo({ title: "", description: "", completed: false });
        fetchTodos();
      } else {
        console.error("Failed to add todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todos.find(todo => todo._id === id).completed }),
      });
      if (response.ok) {
        fetchTodos();
      } else {
        console.error("Failed to toggle todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>
        <div>
        <h1>Create a ToDo</h1>
        <form onSubmit={handleSubmit} style={{display:'flex', alignItems:"center", justifyContent:"center", gap:"2rem"}}>
          <div>
            <label htmlFor="title">ToDo: </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTodo.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="title">Description: </label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTodo.description}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ marginTop: "5px", marginBottom:"5px" }}>
            <button type="submit">Add ToDo!</button>
          </div>
        </form>
      </div>
      <br/>
        <ul>
          {todos.slice().reverse().map((todo) => (
            <div key={todo._id}>
              <li>
                ToDo :{" "}
                {todo.completed === false ? (
                  <span style={{ color: "red" }}>{todo.title}</span>
                ) : (
                  <span style={{ color: "green" }}>{todo.title}</span>
                )}
              </li>
              <h5>Description : {todo.description}</h5>
              {todo.completed === false ? (
                <>
                  <button type="toggle" onClick={() => handleToggle(todo._id)}>Done ?</button>
                </>
              ) : (
                <>
                  <button type="toggle" onClick={() => handleToggle(todo._id)}>Congratulations </button>
                </>
              )}
              <br/>
              <br/>
              <h5>---------------------------------------------------------------------</h5>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
