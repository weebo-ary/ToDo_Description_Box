import React from "react";
import { Box, Card, Typography, Button } from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import { toggleTodo, deleteTodo } from "../api/api";

const TodoList = ({ todos, fetchTodos }) => {
  const handleToggle = async (id) => {
    try {
      const todo = todos.find((todo) => todo._id === id);
      await toggleTodo(id, !todo.completed);
      fetchTodos();
      if (todo.completed) {
        toast.warn("Task Restored Successfully!");
      } else {
        toast.success("Task Completed Successfully!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
      toast.warn("Task Deleted Successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box display={"grid"} gridTemplateColumns={"1fr 1fr 1fr"} gap={'2.5rem'} marginLeft={'1rem'}>
      {todos.slice().reverse().map((todo) => (
        <Box key={todo._id} padding={'1.5rem'}>
          <Card
            sx={{
              padding: "1rem",
              boxShadow: "0px 4px 45px -19px rgba(0,0,0,0.75)",
              borderRadius: "10px",
              width: "90%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign:'center'
            }}
          >
            <Box>
              <Typography style={{ color: todo.completed ? "green" : "red" }}>
                ToDo : {todo.title}
              </Typography>
              <br />
              <Typography>Description : {todo.description}</Typography>
              <br />
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={"1rem"}
              >
                <Button onClick={() => handleToggle(todo._id)}>
                  <Typography color={todo.completed ? "red" : "green"}>
                    {todo.completed ? (
                      <DoDisturbOnOutlinedIcon />
                    ) : (
                      <CheckOutlinedIcon />
                    )}
                  </Typography>
                </Button>
                <Button onClick={() => handleDelete(todo._id)}>
                  <Typography color={"red"}>
                    <DeleteOutlinedIcon />
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default TodoList;
