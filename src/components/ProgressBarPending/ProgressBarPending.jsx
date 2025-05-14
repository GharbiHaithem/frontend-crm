import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './ProgressBarPending.css'
const ProgressBarPending = ({setStartGeneration}) => {
       const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3000; // 3 secondes
    const interval = 50;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const percentage = Math.min((current / steps) * 100, 100);
      setProgress(percentage);
      if (percentage === 100){ clearInterval(timer)
setStartGeneration(false)

      };
    }, interval);

    return () => clearInterval(timer);
  }, []);
  return (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}
  >
    <Box
      sx={{
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Génération de la facture en cours...
      </Typography>
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
    </div>
    </Box>
  </Box>
  )
}

export default ProgressBarPending