import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show sidebar on login page
  if (location.pathname === "/") return null;

  const handleNavigation = (path) => {
    if (path === "/logout") {
      navigate("/"); // Navigate to login
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { label: "Orders", path: "/orders" },
    { label: "Payments", path: "/payments" },
    { label: "Logout", path: "/logout" }
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <List sx={{ width: 200, mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
