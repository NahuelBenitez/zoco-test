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
} from '@mui/material';

const schema = yup.object().shape({
  institution: yup.string().required('Institution is required'),
  degree: yup.string().required('Degree is required'),
  year: yup.number().required('Year is required').min(1900, 'Year must be after 1900').max(new Date().getFullYear(), 'Year cannot be in the future'),
});

function StudyFormDialog({ open, onClose, onCreate }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // In a real app, this would call an API
      const newStudy = {
        id: Math.floor(Math.random() * 10000),
        ...data,
      };
      
      onCreate(newStudy);
      
      onClose();
      reset();
    } catch (err) {
      setError('Failed to add study');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Study</DialogTitle>
      <DialogContent>
        {error && (
          <Box color="error.main" mb={2}>
            {error}
          </Box>
        )}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StudyFormDialog;