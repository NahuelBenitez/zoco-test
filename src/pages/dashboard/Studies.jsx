import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/auth';
import StudyFormDialog from '../../components/dashboard/StudyFormDialog';

function Studies() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const data = await authAPI.getUserStudies(user.id);
        setStudies(data);
      } catch (error) {
        console.error('Error fetching studies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, [user.id]);

  const handleCreateStudy = (newStudy) => {
    setStudies([...studies, newStudy]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Studies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Study
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Institution</TableCell>
              <TableCell>Degree</TableCell>
              <TableCell>Year</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {studies.map((study) => (
              <TableRow key={study.id}>
                <TableCell>{study.institution}</TableCell>
                <TableCell>{study.degree}</TableCell>
                <TableCell>{study.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <StudyFormDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onCreate={handleCreateStudy}
      />
    </Box>
  );
}

export default Studies;