import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  CssBaseline
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import OrderTabs from "./components/OrderTabs";
import Login from "./components/Login";
import PaymentsTable from "./components/PaaymentsList";
import ProtectedRoute from "./components/ProtectRouter";
import Sidebar from "./components/Sidebar";
import { theme, styles } from "./styles/globalStyles";

function AppContent({ orders }) {
  return (
    <>
      <Sidebar />
      <Container sx={{ ...styles.appContainer, ml: 25 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Typography variant="h4" sx={styles.header}>
                  Order Management
                </Typography>
                {orders && <OrderTabs orders={orders} />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Typography variant="h4" sx={styles.header}>
                  Payments
                </Typography>
                <PaymentsTable />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await import("./data/orders.json");
        setOrders(response.orders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={styles.appContainer}>
          <CircularProgress />
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container sx={styles.appContainer}>
          <Typography color="error">Error loading orders: {error}</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent orders={orders} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
