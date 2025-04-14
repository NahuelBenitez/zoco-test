import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
      </Paper>
    </Box>
  );
}

export default Profile;