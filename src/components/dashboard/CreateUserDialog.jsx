import { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

function CreateUserDialog({ 
  open, 
  onClose, 
  onCreate, 
  onUpdate, 
  editingUser,
  currentUserId 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Definir el esquema Yup dentro del componente para acceder a editingUser
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    role: yup.string().required('Role is required'),
    // Password solo requerido para creación
    ...(!editingUser && {
      password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required')
    })
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form when editing user changes
  useEffect(() => {
    if (editingUser) {
      setValue('name', editingUser.name);
      setValue('email', editingUser.email);
      setValue('role', editingUser.role);
    } else {
      reset();
    }
  }, [editingUser, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      if (editingUser) {
        // Excluir password en la actualización
        const { password, ...updateData } = data;
        await onUpdate(updateData);
      } else {
        await onCreate(data);
      }
      
      handleClose();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  const isEditing = !!editingUser;
  const isCurrentUser = editingUser?.id === currentUserId;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit User' : 'Create New User'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isEditing && isCurrentUser && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Note: You cannot edit your own account
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Full Name"
            autoComplete="name"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            disabled={loading}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading || isEditing} // Email no editable en actualización
          />
          
          <FormControl 
            fullWidth 
            margin="normal"
            error={!!errors.role}
          >
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              label="Role"
              {...register('role')}
              disabled={loading || isCurrentUser}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
            {errors.role && (
              <Box color="error.main" fontSize="0.75rem" ml={2} mt={1}>
                {errors.role.message}
              </Box>
            )}
          </FormControl>

          {!isEditing && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
          )}
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
          {loading ? (
            <CircularProgress size={24} />
          ) : isEditing ? (
            'Update User'
          ) : (
            'Create User'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateUserDialog;