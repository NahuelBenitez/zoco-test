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
  street: yup.string().required('Street is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip: yup.string().required('Zip code is required'),
  country: yup.string().required('Country is required'),
});

function AddressFormDialog({ open, onClose, onCreate }) {
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
      const newAddress = {
        id: Math.floor(Math.random() * 10000),
        ...data,
      };
      
      onCreate(newAddress);
      
      onClose();
      reset();
    } catch (err) {
      setError('Failed to add address');
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
      <DialogTitle>Add New Address</DialogTitle>
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
            id="street"
            label="Street"
            autoComplete="street-address"
            autoFocus
            {...register('street')}
            error={!!errors.street}
            helperText={errors.street?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            label="City"
            autoComplete="address-level2"
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="state"
            label="State/Province"
            autoComplete="address-level1"
            {...register('state')}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="zip"
            label="Zip/Postal Code"
            autoComplete="postal-code"
            {...register('zip')}
            error={!!errors.zip}
            helperText={errors.zip?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="country"
            label="Country"
            autoComplete="country"
            {...register('country')}
            error={!!errors.country}
            helperText={errors.country?.message}
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

export default AddressFormDialog;