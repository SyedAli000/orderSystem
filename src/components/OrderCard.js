import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "active"
      ? theme.palette.warning.light
      : status === "shipped"
      ? theme.palette.success.light
      : theme.palette.info.light,
  color: "white",
  fontWeight: "bold",
  marginLeft: theme.spacing(1),
}));

const OrderCard = ({ order }) => {
  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ width: "100%", boxSizing: "border-box" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          flexWrap="wrap"
          width="100%"
        >
          <Box>
            <Typography variant="h6" noWrap>
              {order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Batch: {order.batch}
            </Typography>
          </Box>
          <StatusChip
            label={order.status.toUpperCase()}
            status={order.status}
            size="small"
          />
        </Box>

        <Box mt={2} width="100%">
          <Typography variant="subtitle2" gutterBottom>
            Shipping Address:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {order.shippingAddress}
          </Typography>
        </Box>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Typography variant="subtitle2">Contents:</Typography>
          <Chip label={`Qty: ${order.quantity}`} size="small" sx={{ ml: 1 }} />
        </Box>
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            wordBreak: "break-word",
          }}
        >
          {order.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
