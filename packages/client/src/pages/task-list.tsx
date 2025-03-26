import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  TextField,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  // Initial task data
  const [tasks, setTasks] = useState([
    { id: 1, name: "567", partNo: "392", status: "processing" },
    { id: 2, name: "849", partNo: "459", status: "failed" },
    { id: 3, name: "483", partNo: "260", status: "success" },
  ]);

  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [partNo, setPartNo] = useState("");

  // Function to refresh status (simulated with random status change)
  const refreshStatus = (taskId: number) => {
    const newTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: getRandomStatus() } : task
    );
    setTasks(newTasks);
  };

  // Helper function to generate a random status
  const getRandomStatus = () => {
    const statuses = ["processing", "failed", "success"];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Add new task to the list
  const addTask = () => {
    if (taskName && partNo) {
      const newTask = {
        id: tasks.length + 1,
        name: taskName,
        partNo: partNo,
        status: "processing",
      };
      setTasks([...tasks, newTask]);
      setTaskName("");
      setPartNo("");
    }

    navigate("/");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Items List
      </Typography>

      {/* Form to Add New Task */}
      <Box sx={{ marginBottom: 3 }}>
        <Grid container spacing={2}>
          {/* <Grid item xs={6}>
            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Part No."
              fullWidth
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addTask}>
              Add Item
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Task Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Parent Item</TableCell>
            <TableCell>Source Organization</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.partNo}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color={
                    task.status === "failed"
                      ? "error"
                      : task.status === "success"
                        ? "green"
                        : "blue"
                  }
                >
                  {task.status}
                </Typography>
              </TableCell>
              <TableCell>
                {task.status === "processing" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => refreshStatus(task.id)}
                    disabled={task.status !== "processing"}
                  >
                    {task.status !== "processing" ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      "Refresh Status"
                    )}
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TaskList;
