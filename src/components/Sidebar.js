import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path === "/logout") {
      onLogout();
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { label: "Orders", path: "/orders" },
    { label: "Payments", path: "/payments" },
    { label: "Logout", path: "/logout" },
  ];

  // Don't show sidebar on login page
  if (location.pathname === "/") return null;

  const drawerContent = (
    <Box sx={{ pt: 4 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path && item.label !== 'Logout'}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: 'none',
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
