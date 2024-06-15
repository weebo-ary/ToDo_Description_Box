import React, { useState, useEffect } from "react";
import { Box, Divider } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchTodos } from "./api/api";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { TabPanel, TodoTabs } from "./components/Tabs";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await fetchTodos();
        setTodos(todos);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getTodos();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTodosAndUpdate = async () => {
    try {
      const todos = await fetchTodos();
      setTodos(todos);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <Box overflow={'hidden'} display="flex" flexDirection="column">
       <TodoForm fetchTodos={fetchTodosAndUpdate} />
       <Divider />
      <Box display="flex" flexDirection="row">
      <Box display="flex" flexDirection="column">
        <TodoTabs
          value={value}
          handleChange={handleChange}
          allTodos={todos}
          pendingTodos={pendingTodos}
          completedTodos={completedTodos}
        />
      </Box>
      <Box>
        <TabPanel value={value} index={0}>
          <TodoList todos={todos} fetchTodos={fetchTodosAndUpdate} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TodoList todos={pendingTodos} fetchTodos={fetchTodosAndUpdate} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TodoList todos={completedTodos} fetchTodos={fetchTodosAndUpdate} />
        </TabPanel>
      </Box>
      </Box>
     
      <ToastContainer />
    </Box>
  );
};

export default App;