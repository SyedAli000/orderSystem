import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  CssBaseline,
  useMediaQuery
} from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import OrderTabs from "./components/OrderTabs";
import Login from "./components/Login";
import PaymentsTable from "./components/PaaymentsList";
import ProtectedRoute from "./components/ProtectRouter";
import Sidebar from "./components/Sidebar";
import { theme, styles } from "./styles/globalStyles";

function AppContent() {
  const drawerWidth = 240;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage or token
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      // Try to get user info from token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setUserInfo(null);
          } else {
            setUserInfo({
              code: decodedToken.code,
              email: decodedToken.email,
              name: decodedToken.name,
              role: decodedToken.role,
            });
          }
        } catch (error) {
          // console.error('Error parsing token:', error);
          localStorage.removeItem('token');
          setUserInfo(null);
        }
      }
    }
  }, []);

  const showSidebar = location.pathname !== "/" && localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    window.location.href = "/";
  };

  return (
    <>
      {showSidebar && <Sidebar onLogout={handleLogout} userInfo={userInfo} />}
      <Container sx={{ 
        ...styles.appContainer,
        overflowX: 'hidden',
        width: '100%',
        ml: showSidebar && !isMobile ? `${drawerWidth}px` : 0,
      }}>
        <Routes>
          <Route path="/" element={
            localStorage.getItem("isLoggedIn") === "true" ? <Navigate to="/orders" replace /> : <Login />
          } />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <>
                  <Typography variant="h4" sx={styles.header}>
                    Order Management
                  </Typography>
                  <OrderTabs />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <>
                  <Typography variant="h4" sx={styles.header}>
                    Payments
                  </Typography>
                  <PaymentsTable />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const token = localStorage.getItem("token");
      
      if (isLoggedIn && token) {
        // Token exists, app is ready
        setLoading(false);
      } else {
        // No authentication, app is ready
        setLoading(false);
      }
    };

    checkAuth();
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
