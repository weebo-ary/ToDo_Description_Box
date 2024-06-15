import React from "react";
import { Box, Tabs, Tab, Badge, Typography } from "@mui/material";

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <span>{children}</span>
        </Box>
      )}
    </Box>
  );
};

const TodoTabs = ({ value, handleChange, allTodos, pendingTodos, completedTodos }) => {
  return (
    <Tabs
      orientation="vertical"
      value={value}
      onChange={handleChange}
      aria-label="Vertical tabs example"
      sx={{
        borderRight: 1,
        borderColor: "divider",
        height: "60vh",
        padding: "1rem",
        width: "100%",
      }}
    >
      <Tab
        label={
          <Badge badgeContent={allTodos.length} color="warning">
            <Typography marginRight={'1rem'}>All Tasks</Typography>
          </Badge>
        }
        {...a11yProps(0)}
      />
      <Tab
        label={
          <Badge badgeContent={pendingTodos.length} color="error">
            <Typography marginRight={'1rem'}>Pending</Typography>
          </Badge>
        }
        {...a11yProps(1)}
      />
      <Tab
        label={
          <Badge badgeContent={completedTodos.length} color="success">
            <Typography marginRight={'1rem'}>Completed</Typography>
          </Badge>
        }
        {...a11yProps(2)}
      />
    </Tabs>
  );
};

export { TabPanel, TodoTabs };
