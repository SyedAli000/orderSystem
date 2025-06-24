import React, { useState, useEffect,useCallback } from "react";
import {
  Tabs,
  Tab,
  Box,
  useMediaQuery,
  useTheme,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
  Fab
} from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import OrderCard from "./OrderCard";
import CameraOverlay from "./CameraOverlay";

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

const OrderTabs = () => {
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState({ orders: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  
  const itemsPerPage = 5;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  // Fetch orders from API
const fetchOrders = useCallback(async (status = "pending") => {
    try {
      setLoading(true);
      setError("");
      let url = `${apiUrl}/api/order?page=${page}&limit=${itemsPerPage}`;
      if (status !== 'all') {
        url += `&status=${status}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Could not parse error response from server.' }));
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      setOrders({ orders: data.orders || [], pagination: data.pagination || {} });
    } catch (error) {
      setError(error.message || "Failed to fetch orders");
      setOrders({ orders: [], pagination: {} });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, page, token, itemsPerPage]);



  const handleQRUpload = async (file) => {
    if (!file) {
      setShowCamera(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${apiUrl}/api/order/qr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process QR code');
      }
      
      // Refresh the order list to show the new order
      fetchOrders(); 

    } catch (error) {
      setError(error.message || "Failed to process QR code");
    } finally {
      setLoading(false);
      setShowCamera(false); // Close camera after upload attempt
    }
  };

  useEffect(() => {
    const statusMapping = ['pending', 'shipped', 'mine'];
    const currentStatus = statusMapping[value];
    fetchOrders(currentStatus);
  }, [page, value,fetchOrders]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setPage(1);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const tabLabels = [
    { label: "PENDING", count: orders.pagination?.total_pending || 0 },
    { label: "SHIPPED", count: orders.pagination?.total_shipped || 0 },
    { label: "MINE", count: orders.pagination?.total_mine || 0 }
  ];

  const getPaginatedOrders = (ordersList) => {
    return Array.isArray(ordersList) ? ordersList : [];
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%", overflow: "hidden" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="order tabs"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{
            width: "100%",
            overflow: "hidden"
          }}
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
                      backgroundColor: value === index ? theme.palette.primary.main : theme.palette.action.selected,
                      color: value === index ? theme.palette.common.white : theme.palette.text.secondary,
                      borderRadius: "12px",
                      px: 1,
                      py: 0.5,
                      minWidth: 24,
                      height: 24,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 'bold'
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

      {/* Tabs Content */}
      <TabPanel value={value} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 2 }}>
          {getPaginatedOrders(orders.orders).length > 0 ? (
            getPaginatedOrders(orders.orders).map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Alert severity="info">No pending orders found.</Alert>
          )}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 2 }}>
          {getPaginatedOrders(orders.orders).length > 0 ? (
            getPaginatedOrders(orders.orders).map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Alert severity="info">No shipped orders found.</Alert>
          )}
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 2 }}>
          {getPaginatedOrders(orders.orders).length > 0 ? (
            getPaginatedOrders(orders.orders).map(order => <OrderCard key={order.id} order={order} />)
          ) : (
            <Alert severity="info">No orders found.</Alert>
          )}
        </Box>
      </TabPanel>
        
        {orders.pagination?.total_pages > 1 && (
          <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
            <Pagination
              count={orders.pagination?.total_pages || 1}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
          </Stack>
        )}

      <CameraOverlay
        open={showCamera}
        onCapture={handleQRUpload}
        onClose={() => setShowCamera(false)}
      />

      <Fab
        color="primary"
        onClick={() => setShowCamera(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200
        }}
      >
        <CameraAltIcon />
      </Fab>
    </Box>
  );
};

export default OrderTabs;
