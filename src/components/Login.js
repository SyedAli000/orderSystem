import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import {  useNavigate } from "react-router-dom";

const Login = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (code === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/orders");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: isMobile ? 0 :30,
        px: 2, // horizontal padding on small screens
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 3, sm: 6 },   // padding 24px on xs, 48px on sm and up
          width: { xs: "90%", sm: 400 }, // 90% width on xs, fixed 400px on sm+
          height: { xs: "auto", sm: 320 }, // auto height on small screens for better fit
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          fullWidth
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, height: 50 }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
