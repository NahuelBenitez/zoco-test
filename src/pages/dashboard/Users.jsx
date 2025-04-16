import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  CircularProgress,
  Alert,
  Chip
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
import CreateUserDialog from '../../components/dashboard/CreateUserDialog';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const { user: currentUser, role } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await authAPI.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      setError('');
      const newUser = await authAPI.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please try again.');
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setError('');
      const updatedUser = await authAPI.updateUser(editingUser.id, userData);
      setUsers(prev => 
        prev.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      setEditingUser(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUser.id) {
      setError('You cannot delete your own account');
      return;
    }

    try {
      setError('');
      const success = await authAPI.deleteUser(userId);
      if (success) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleOpenEditDialog = (user) => {
    setEditingUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setOpenDialog(false);
    setError('');
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70 
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      minWidth: 200,
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      minWidth: 250,
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'admin' ? 'primary' : 'default'} 
          size="small"
        />
      ),
    },
  ];

  // Add actions column only for admin users
  if (role === 'admin') {
    columns.push({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => {
        const isCurrentUser = params.row.id === currentUser.id;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleOpenEditDialog(params.row)}
            disabled={isCurrentUser}
            showInMenu
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteUser(params.row.id)}
            disabled={isCurrentUser}
            showInMenu
            sx={{ color: 'error.main' }}
          />,
        ];
      },
    });
  }

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
        <Typography variant="h4">Users Management</Typography>
        {role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Create User
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
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

      <CreateUserDialog
        open={openDialog} 
        onClose={handleCloseDialog}
        onCreate={handleCreateUser}
        onUpdate={handleUpdateUser}
        editingUser={editingUser}
        currentUserId={currentUser.id}
      />
    </Box>
  );
}

export default Users;