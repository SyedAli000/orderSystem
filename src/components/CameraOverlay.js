// components/CameraOverlay.js
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
  Backdrop,
} from "@mui/material";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";

const CameraOverlay = ({ open, onCapture, onClose }) => {
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      const enableStream = async () => {
        try {
          // Stop any existing stream before starting a new one
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          if (err.name === "NotAllowedError") {
            setError("Camera access was denied. Please allow camera access in your browser settings.");
          } else {
            setError("Could not start camera. Please ensure it is not in use by another application.");
          }
          // console.error("Camera error:", err);
          onClose(); // Close overlay on error
        }
      };
      enableStream();
    } else {
      // Cleanup stream when the overlay is closed
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    // Cleanup function to run when the component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [open, facingMode, onClose]);
  console.log(error);
  

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            onCapture(file);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <Backdrop open={open} sx={{ zIndex: 1400, bgcolor: "rgba(0,0,0,0.8)" }}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          maxWidth: isMobile ? "95%" : 600,
          width: "100%",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: "100%",
            maxHeight: "400px",
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
        <Box display="flex" gap={2} justifyContent="center">
          <Button variant="contained" onClick={captureImage}>
            Capture
          </Button>
          <IconButton
            onClick={() =>
              setFacingMode((prev) =>
                prev === "user" ? "environment" : "user"
              )
            }
            color="primary"
          >
            <FlipCameraIosIcon />
          </IconButton>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Paper>
    </Backdrop>
  );
};

export default CameraOverlay;
