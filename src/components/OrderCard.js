import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return '#ff9800'; // Orange
    case 'shipped':
      return '#4caf50'; // Green
    case 'mine':
      return '#2196f3'; // Blue
    default:
      return '#9e9e9e'; // Grey
  }
};

const StyledChip = styled(Chip)(({ theme, status }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: getStatusColor(status),
  color: 'white',
  fontWeight: 'bold',
  height: '24px',
  fontSize: '0.75rem',
}));

const QtyChip = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.secondary,
  fontWeight: 'bold',
  padding: '2px 8px',
  borderRadius: '16px',
  fontSize: '0.8rem',
}));

const OrderCard = ({ order }) => {
  // Construct the address from the flat shipping properties
  const shippingAddress = [
    order.shipping_address1,
    order.shipping_city,
    order.shipping_state,
    order.shipping_zip,
    order.shipping_country
  ].filter(Boolean).join(', ');

  return (
    <Card sx={{ position: 'relative', mb: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <StyledChip
          label={order.status?.toUpperCase() || "UNKNOWN"}
          status={order.status}
        />
        
        <Box sx={{ pr: '80px' }}> {/* Padding to avoid text overlapping with chip */}
          <Typography variant="h6" component="div" fontWeight="bold">
            {`ORD-${order.number}`}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Batch: {order.batch || `BATCH-${order.id.substring(0,8)}...`}
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            Shipping Address:
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {shippingAddress || 'N/A'}
          </Typography>
          
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Contents:
          </Typography>
          <Typography variant="body2">
            {order.contents || 'Personal Items'}
          </Typography>
        </Box>

        <QtyChip>
          Qty: {order.quantity || 4}
        </QtyChip>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
