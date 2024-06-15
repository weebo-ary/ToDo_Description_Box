import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography} from "@mui/material";
import { toast } from "react-toastify";
import { createTodo } from "../api/api";

const TodoForm = ({ fetchTodos }) => {
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(
      newTodo.title.trim() !== "" && newTodo.description.trim() !== ""
    );
  }, [newTodo]);

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
      await createTodo(newTodo);
      setNewTodo({ title: "", description: "", completed: false });
      fetchTodos();
      toast.success("Task Added Successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'} padding={'1rem'}>
      <Typography variant="h4" paddingTop={"1rem"}>
        Create a TODO
      </Typography>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"2rem"}
        width={"100%"}
        padding={"2rem"}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"row"}
            gap={"2rem"}
          >
            <TextField
              type="text"
              variant="outlined"
              id="title"
              name="title"
              label="ToDo"
              value={newTodo.title}
              onChange={handleInputChange}
              required
              size="small"
            />
            <TextField
              type="text"
              id="description"
              name="description"
              label="Description"
              value={newTodo.description}
              onChange={handleInputChange}
              required
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isFormValid}
              size="medium"
            >
              Add ToDo
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default TodoForm;
