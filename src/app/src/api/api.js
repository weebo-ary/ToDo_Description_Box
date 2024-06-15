const API_URL = process.env.REACT_APP_API || 'http://localhost:8000'
export const fetchTodos = async () => {
  try {
    const response = await fetch(`${API_URL}/todos/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.statusText}`);
    }
    const data = await response.json();
    return data.todos;
  } catch (error) {
    throw new Error(`Error fetching todos: ${error.message}`);
  }
};

export const createTodo = async (todo) => {
  try {
    const response = await fetch(`${API_URL}/todos/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error(`Failed to add todo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error adding todo: ${error.message}`);
  }
};

export const toggleTodo = async (id, completed) => {
  try {
    const response = await fetch(`${API_URL}/todos/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error(`Failed to toggle todo: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error toggling todo: ${error.message}`);
  }
};


 export const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchTodos();
      } else {
        console.error("Failed to delete todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
