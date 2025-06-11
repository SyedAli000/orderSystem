import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Pagination,
  Stack,
} from "@mui/material";
import OrderCard from "./OrderCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2, width: "100%", overflow: "hidden" }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const OrderTabs = ({ orders }) => {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const tabLabels = [
    { label: "Active", count: orders.active.length },
    { label: "Shipped", count: orders.shipped.length },
    { label: "Mine", count: orders.mine.length },
  ];

  const getPaginatedOrders = (orders) => {
    const startIndex = (page - 1) * itemsPerPage;
    return orders.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="order tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{ maxWidth: "100%" }}
        >
          {tabLabels.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box display="flex" alignItems="center">
                  {tab.label}
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      backgroundColor: theme.palette.action.selected,
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                    }}
                  >
                    {tab.count}
                  </Box>
                </Box>
              }
              {...a11yProps(index)}
              sx={{ minWidth: "unset", px: 2 }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Active Orders Tab */}
      <TabPanel value={value} index={0}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {getPaginatedOrders(orders.active).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
        {orders.active.length > itemsPerPage && (
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              count={Math.ceil(orders.active.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        )}
      </TabPanel>

      {/* Shipped Orders Tab */}
      <TabPanel value={value} index={1}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {getPaginatedOrders(orders.shipped).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
        {orders.shipped.length > itemsPerPage && (
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              count={Math.ceil(orders.shipped.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        )}
      </TabPanel>

      {/* My Orders Tab */}
      <TabPanel value={value} index={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          {getPaginatedOrders(orders.mine).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
        {/* {orders.mine.length > itemsPerPage && ( */}
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Pagination
            count={Math.ceil(orders.mine.length / itemsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </Stack>
        {/* )} */}
      </TabPanel>
    </Box>
  );
};

export default OrderTabs;
