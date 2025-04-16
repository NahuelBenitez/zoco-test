import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { 
  DataGrid, 
  GridToolbar,
  GridActionsCellItem 
} from '@mui/x-data-grid';
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

  const columns = [
    { 
      field: 'street', 
      headerName: 'Street', 
      flex: 1,
      minWidth: 150,
    },
    { 
      field: 'city', 
      headerName: 'City', 
      flex: 1,
      minWidth: 100,
    },
    { 
      field: 'state', 
      headerName: 'State', 
      flex: 1,
      minWidth: 100,
    },
    { 
      field: 'zip', 
      headerName: 'Zip Code', 
      flex: 1,
      minWidth: 100,
    },
    { 
      field: 'country', 
      headerName: 'Country', 
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleOpenEditDialog(params.row)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteAddress(params.row.id)}
          showInMenu
        />,
      ],
    },
  ];

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
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={addresses}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'primary.light',
              color: 'common.black',
            },
            '& .MuiDataGrid-menuIconButton': {
              color: 'common.black',
            },
            '& .MuiDataGrid-toolbarContainer': {
              p: 2,
            },
          }}
        />
      </Paper>

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