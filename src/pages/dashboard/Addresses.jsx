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
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../api/auth';
import AddressFormDialog from '../../components/dashboard/AdressessFormDialog';


function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await authAPI.getUserAddresses(user.id);
        setAddresses(data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load addresses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user.id]);

  const handleCreateAddress = async (addressData) => {
    try {
      setError('');
      const newAddress = await authAPI.addAddress(user.id, addressData);
      setAddresses(prev => [...prev, newAddress]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating address:', error);
      setError('Failed to create address. Please try again.');
    }
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      setError('');
      const updatedAddress = await authAPI.updateAddress(
        user.id, 
        editingAddress.id, 
        addressData
      );
      setAddresses(prev => 
        prev.map(addr => addr.id === updatedAddress.id ? updatedAddress : addr)
      );
      setEditingAddress(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating address:', error);
      setError('Failed to update address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      setError('');
      const success = await authAPI.deleteAddress(user.id, addressId);
      if (success) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  const handleOpenEditDialog = (address) => {
    setEditingAddress(address);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingAddress(null);
    setOpenDialog(false);
    setError('');
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
        <Typography variant="h4">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Address
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Street</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zip</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>{address.street}</TableCell>
                  <TableCell>{address.city}</TableCell>
                  <TableCell>{address.state}</TableCell>
                  <TableCell>{address.zip}</TableCell>
                  <TableCell>{address.country}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenEditDialog(address)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteAddress(address.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No addresses found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddressFormDialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        onCreate={handleCreateAddress}
        onUpdate={handleUpdateAddress}
        editingAddress={editingAddress}
      />
    </Box>
  );
}

export default Addresses;