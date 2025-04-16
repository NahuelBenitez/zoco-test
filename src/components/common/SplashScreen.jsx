
import { Box, Fade } from '@mui/material';
import { useEffect, useState } from 'react';
import zocoLogo from '../../assets/zoco-logo.png'; 

function SplashScreen({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 500); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Fade in={visible} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: '#fff',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          component="img"
          src={zocoLogo}
          alt="Zoco Logo"
          sx={{
            width: 150,
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.7; }
              100% { transform: scale(1); opacity: 1; }
            }
          `}
        </style>
      </Box>
    </Fade>
  );
}

export default SplashScreen;
