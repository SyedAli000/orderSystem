// components/CameraOverlay.js
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Fab,
  useMediaQuery,
  useTheme,
  Backdrop,
} from "@mui/material";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const CameraOverlay = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (showCamera && !streamRef.current) {
      const enableStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        } catch (err) {
          console.error("Camera error:", err);
          setShowCamera(false);
        }
      };
      enableStream();
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [showCamera, facingMode]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageUrl);
      setShowCamera(false);
    }
  };

  return (
    <>
      {/* Floating camera FAB */}
      <Fab
        color="primary"
        aria-label="camera"
        onClick={() => {
          setShowCamera(true);
          setCapturedImage(null);
        }}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
        }}
      >
        <CameraAltIcon />
      </Fab>

      {/* Camera View Overlay */}
      <Backdrop open={showCamera} sx={{ zIndex: 1400, bgcolor: "rgba(255,255,255,0.95)" }}>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 4,
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
              backgroundColor: "#000",
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
              sx={{ border: "1px solid #ccc" }}
            >
              <FlipCameraIosIcon />
            </IconButton>
            <Button variant="outlined" onClick={() => setShowCamera(false)}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Backdrop>

      {/* Captured Image Overlay */}
      <Backdrop open={!!capturedImage} sx={{ zIndex: 1350, bgcolor: "rgba(255,255,255,0.95)" }}>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 4,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            maxWidth: isMobile ? "95%" : 600,
            width: "100%",
          }}
        >
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          <Button
            variant="outlined"
            onClick={() => setCapturedImage(null)}
            sx={{ alignSelf: "center" }}
          >
            Close
          </Button>
        </Paper>
      </Backdrop>
    </>
  );
};

export default CameraOverlay;
