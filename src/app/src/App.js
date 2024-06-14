import React, { useEffect, useState } from "react";
import "./App.css";
import {
  Box,
  TextField,
  Button,
  Divider,
  Card,
  Typography,
  Badge,
} from "@mui/material";
import TabPanel from "./components/Tabs";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [valueTab, setValueTab] = React.useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const completedTrueLength = todos.filter((todo) => todo.completed).length;
  const completedFalseLength = todos.filter((todo) => !todo.completed).length;
  const allTodos = todos.length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({
      ...newTodo,
      [name]: value,
    });
  };

  useEffect(() => {
    setIsFormValid(
      newTodo.title.trim() !== "" && newTodo.description.trim() !== ""
    );
  }, [newTodo]);

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
        toast.success("Task Added Successfully!");
      } else {
        toast.error("Failed to add todo:", response.statusText);
      }
    } catch (error) {
      toast.error("Error adding todo:", error);
    }
  };

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
        toast.error("Failed to fetch todos:", response.statusText);
      }
    } catch (error) {
      toast.error("Error fetching todos:", error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const isCompleted = todos.find((todo) => todo._id === id).completed;
      const response = await fetch(`http://localhost:8000/todos/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todos.find((todo) => todo._id === id).completed,
        }),
      });
      if (response.ok) {
        fetchTodos();
        if (isCompleted) {
          toast.warn("Task Restored Successfully!");
        } else {
          toast.success("Task Completed Successfully!");
        }
      } else {
        toast.error("Failed to toggle todo:", response.statusText);
      }
    } catch (error) {
      toast.error("Error toggling todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        fetchTodos();
        toast.warn("Task Deleted Successfully!");
      } else {
        toast.error("Failed to delete todo:", response.statusText);
      }
    } catch (error) {
      toast.error("Error deleting todo:", error);
    }
  };

  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };

  return (
    <Box className="App">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        progress={undefined}
        theme="light"
      />
      <Box>
      <Typography variant="h4" paddingTop={"1rem"}>Create a TODO</Typography>
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
            sx={{
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
              />
              <TextField
                type="text"
                id="description"
                name="description"
                label="Description"
                value={newTodo.description}
                onChange={handleInputChange}
                required
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormValid}
              >
                Add ToDo
              </Button>
            </Box>
          </form>
        </Box>
        <Divider />
        <br />
        <Typography variant="h4">List of TODO's</Typography>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: 224,
          }}
        >
          <Tabs
            orientation="vertical"
            value={valueTab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              height: "50vh",
              padding: "1rem",
              width: "15%",
            }}
          >
            <Tab
              label={
                <Badge badgeContent={allTodos} color="error">
                  <Typography marginRight={"20px"}>All</Typography>
                </Badge>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge badgeContent={completedFalseLength} color="error">
                  <Typography marginRight={"20px"}>Pending</Typography>
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Badge badgeContent={completedTrueLength} color="success">
                  <Typography marginRight={"20px"}>Completed</Typography>
                </Badge>
              }
              {...a11yProps(2)}
            />
          </Tabs>
          <TabPanel value={valueTab} index={0}>
            <Box
              display={"grid"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              gap={"1.5rem"}
            >
              {todos
                .slice()
                .reverse()
                .map((todo) => (
                  <Box key={todo._id} padding={"1rem"}>
                    <Card
                      sx={{
                        padding: "1rem",
                        "-webkit-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "-moz-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "box-shadow": "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        borderRadius: "10px",
                        width: "90%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {todo.completed === false ? (
                          <Typography style={{ color: "red" }}>
                            ToDo : {todo.title}
                          </Typography>
                        ) : (
                          <Typography style={{ color: "green" }}>
                            ToDo : {todo.title}
                          </Typography>
                        )}
                        <br />
                        <Typography>
                          Description : {todo.description}
                        </Typography>
                        <br />
                        {todo.completed === false ? (
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"1rem"}
                          >
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                            >
                              <Typography color={"green"}>
                                <CheckOutlinedIcon />
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                              disabled
                            >
                              <Typography>
                                <DoDisturbOnOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleDelete(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DeleteOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                          </Box>
                        ) : (
                          <>
                          <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                              disabled
                            >
                                <CheckOutlinedIcon />
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DoDisturbOnOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleDelete(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DeleteOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                          </>
                        )}
                      </Box>
                    </Card>
                  </Box>
                ))}
            </Box>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <Box
              display={"grid"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              gap={"1.5rem"}
            >
              {todos
                .filter((todo) => !todo.completed)
                .slice()
                .reverse()
                .map((todo) => (
                  <Box key={todo._id} padding={"1rem"}>
                    <Card
                      sx={{
                        padding: "1rem",
                        "-webkit-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "-moz-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "box-shadow": "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        borderRadius: "10px",
                        width: "90%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        {todo.completed === false ? (
                          <Typography style={{ color: "red" }}>
                            ToDo : {todo.title}
                          </Typography>
                        ) : (
                          <Typography style={{ color: "green" }}>
                            ToDo : {todo.title}
                          </Typography>
                        )}
                        <br />
                        <Typography>
                          Description : {todo.description}
                        </Typography>
                        <br />
                        {todo.completed === false ? (
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"1rem"}
                          >
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                            >
                              <Typography color={"green"}>
                                <CheckOutlinedIcon />
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                              disabled
                            >
                              <Typography>
                                <DoDisturbOnOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleDelete(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DeleteOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                          </Box>
                        ) : (
                          <>
                            <Button
                              type="toggle"
                              onClick={() => handleToggle(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DoDisturbOnOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                            <Button
                              type="toggle"
                              onClick={() => handleDelete(todo._id)}
                            >
                              <Typography color={"red"}>
                                <DeleteOutlinedIcon />{" "}
                              </Typography>
                            </Button>
                          </>
                        )}
                      </Box>
                    </Card>
                  </Box>
                ))}
            </Box>
          </TabPanel>
          <TabPanel value={valueTab} index={2}>
            <Box
              display={"grid"}
              gridTemplateColumns={"1fr 1fr 1fr"}
              // padding={"1.5rem"}
              gap={"2rem"}
            >
              {todos
                .filter((todo) => todo.completed)
                .slice()
                .reverse()
                .map((todo) => (
                  <Box key={todo._id} padding={"1rem"}>
                    <Card
                      sx={{
                        padding: "1rem",
                        "-webkit-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "-moz-box-shadow":
                          "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        "box-shadow": "0px 4px 45px -19px rgba(0,0,0,0.75)",
                        borderRadius: "10px",
                        width: "90%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {todo.completed === false ? (
                        <Typography style={{ color: "red" }}>
                          ToDo : {todo.title}
                        </Typography>
                      ) : (
                        <Typography style={{ color: "green" }}>
                          ToDo : {todo.title}
                        </Typography>
                      )}
                      <br />
                      <Typography>Description : {todo.description}</Typography>
                      <br />
                      {todo.completed === false ? (
                        <>
                          <Button
                            type="toggle"
                            onClick={() => handleToggle(todo._id)}
                          >
                            <CheckOutlinedIcon />
                          </Button>
                        </>
                      ) : (
                        <Box
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          gap={"1rem"}
                        >
                          <Button
                            type="toggle"
                            onClick={() => handleToggle(todo._id)}
                          >
                            <Typography color={"red"}>
                              <DoDisturbOnOutlinedIcon />{" "}
                            </Typography>
                          </Button>
                          <Button
                            type="toggle"
                            onClick={() => handleToggle(todo._id)}
                            disabled
                          >
                            <CheckOutlinedIcon />
                          </Button>
                          <Button
                            type="toggle"
                            onClick={() => handleDelete(todo._id)}
                          >
                            <Typography color={"red"}>
                              <DeleteOutlinedIcon />{" "}
                            </Typography>
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Box>
                ))}
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
