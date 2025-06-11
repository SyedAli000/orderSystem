import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  IconButton
} from "@mui/material";
import moment from "moment";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';

// Mock payments data (replace with actual prop if needed)
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
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front camera, 'environment' for back camera
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (showCamera && !streamRef.current) {
      const enableStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode
            }
          });
          streamRef.current = stream;
          console.log("Camera stream obtained in useEffect:", stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            console.log("Video element srcObject set and play() called in useEffect.");
          }
        } catch (err) {
          console.error("Error accessing camera in useEffect:", err);
          setShowCamera(false);
        }
      };
      enableStream();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        console.log("Camera stream stopped and cleared.");
      }
    };
  }, [showCamera, facingMode]);

  const startCamera = () => {
    if (!showCamera) {
      setShowCamera(true);
      setCapturedImage(null);
    }
  };

  const stopCamera = () => {
    setShowCamera(false);
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageUrl);
      stopCamera(); 
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Payments List</Typography>
        <Button
          variant="contained"
          startIcon={<CameraAltIcon />}
          onClick={startCamera}
          disabled={showCamera}
        >
          Take Picture
        </Button>
      </Box>

      {showCamera && (
        <Box sx={{ mb: 2, position: 'relative' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', maxWidth: '500px', border: '1px solid #ccc' }}
          />
          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
            <Button variant="contained" color="primary" onClick={captureImage}>
              Capture
            </Button>
            <IconButton 
              color="primary" 
              onClick={switchCamera}
              sx={{ border: '1px solid #ccc' }}
            >
              <FlipCameraIosIcon />
            </IconButton>
            <Button variant="outlined" onClick={stopCamera}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      {capturedImage && (
        <Box sx={{ mb: 2 }}>
          <img src={capturedImage} alt="Captured" style={{ maxWidth: '500px' }} />
        </Box>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Receiver</strong>
              </TableCell>
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
    </Paper>
  );
};

export default PaymentsTable;
