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
  Grid2,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LineProgress } from "src/components/LineProgress";
import {
  useTaskListQuery,
  useUpdateStatusMutation,
} from "src/slices/apis/app.api";
import { getErrorMessage, ITask } from "src/slices/apis/types";

const TaskList = () => {
  const { data, refetch, isFetching } = useTaskListQuery({});
  const [updateMutation, { isLoading }] = useUpdateStatusMutation();

  const navigate = useNavigate();

  // Function to refresh status (simulated with random status change)
  const refreshStatus = async (taskId: string) => {
    const { data, error } = await updateMutation({
      body: {
        status: "processing",
      },
      params: {
        id: taskId,
      },
    });

    if (error) return toast.error(getErrorMessage(error));

    toast.success(data.message);

    refetch();
  };

  // Helper function to generate a random status
  // const getRandomStatus = () => {
  //   const statuses = ["processing", "failed", "success"];
  //   return statuses[Math.floor(Math.random() * statuses.length)];
  // };

  // Add new task to the list
  const addTask = () => {
    navigate("/");
  };

  if (isFetching) return <LineProgress />;
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Items List
      </Typography>

      {/* Form to Add New Task */}
      <Box sx={{ marginBottom: 3 }}>
        <Grid2 container spacing={2}>
          {/* <Grid2 size={{ xs: 6 }}>
            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <TextField
              label="Part No."
              fullWidth
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
            />
          </Grid2> */}
          <Grid2 size={{ xs: 12 }}>
            <Button variant="contained" color="primary" onClick={addTask}>
              Add Item
            </Button>
          </Grid2>
        </Grid2>
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
          {data?.data?.map((task: ITask) => (
            <TableRow key={task.id}>
              <TableCell>{task.parentPart}</TableCell>
              <TableCell>{task.sourceOrg}</TableCell>
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
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
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
