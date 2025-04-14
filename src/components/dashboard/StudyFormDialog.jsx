import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object().shape({
  institution: yup.string().required('Institution is required'),
  degree: yup.string().required('Degree is required'),
  year: yup.number()
    .required('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
});

function StudyFormDialog({ open, onClose, onCreate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Llamada real a la API
      const newStudy = await authAPI.addStudy(user.id, data);
      
      onCreate(newStudy); // Actualizar el estado en el componente padre
      handleClose();
    } catch (err) {
      console.error('Error adding study:', err);
      setError('Failed to add study. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Study</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="institution"
            label="Institution"
            autoComplete="institution"
            autoFocus
            {...register('institution')}
            error={!!errors.institution}
            helperText={errors.institution?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="degree"
            label="Degree"
            autoComplete="degree"
            {...register('degree')}
            error={!!errors.degree}
            helperText={errors.degree?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="year"
            label="Year"
            type="number"
            {...register('year')}
            error={!!errors.year}
            helperText={errors.year?.message}
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          variant="contained"
          disabled={loading || !isValid}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Study'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudyFormDialog;