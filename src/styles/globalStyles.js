import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

export const styles = {
  appContainer: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  header: {
    marginBottom: "30px",
    textAlign: "center",
    color: "#1976d2",
  },
  tabContainer: {
    marginTop: "20px",
  },
  orderGrid: {
    marginTop: "20px",
  },
};
