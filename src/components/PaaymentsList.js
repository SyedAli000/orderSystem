import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Fab
} from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import moment from "moment";
import CameraOverlay from "./CameraOverlay";
import './PaymentsList.css';

const mockPayments = [
  {
    id: 1,
    date: "2025-06-10T19:00:00.000Z",
    amount: 1200,
    receiver: "Jane Doe"
  },
  {
    id: 2,
    date: "2025-06-12T14:30:00.000Z",
    amount: 950,
    receiver: "John Smith"
  }
];

const PaymentsTable = ({ payments = mockPayments }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <Box sx={{ position: 'relative', pb: 8 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payments List
        </Typography>

        {capturedImage && (
          <Box className="captured-image-container">
            <img src={capturedImage} alt="Captured" className="captured-image" />
          </Box>
        )}

        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Amount</strong></TableCell>
                  <TableCell><strong>Receiver</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {moment(payment.date).format("DD MMMM, YYYY [at] hh:mm A")}
                    </TableCell>
                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>{payment.receiver}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* <CameraOverlay
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(image) => setCapturedImage(image)}
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
      </Fab> */}
      <CameraOverlay/>
    </Box>
  );
};

export default PaymentsTable;
