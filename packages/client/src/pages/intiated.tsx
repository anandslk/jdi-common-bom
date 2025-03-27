import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ProcessInitiated = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 70px)",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          width: 400,
        }}
      >
        <Typography variant="h6" sx={{ color: "#4CAF50", marginBottom: 2 }}>
          Process initiated successfully!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Your task has been successfully started.
        </Typography>

        <Box
          component={Link}
          to="/"
          sx={{
            color: "#007BFF",
            fontSize: 16,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Click here to create another task
        </Box>
      </Box>
    </Box>
  );
};

export default ProcessInitiated;
