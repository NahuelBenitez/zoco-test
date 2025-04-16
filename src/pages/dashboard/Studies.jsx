import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../api/auth";
import StudyFormDialog from "../../components/dashboard/StudyFormDialog";

function Studies() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudy, setEditingStudy] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await authAPI.getUserStudies(user.id);
        setStudies(data);
      } catch (error) {
        console.error("Error fetching studies:", error);
        setError("Failed to load studies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudies();
  }, [user.id]);

  const handleCreateStudy = async (studyData) => {
    try {
      setError("");
      const newStudy = await authAPI.addStudy(user.id, studyData);
      setStudies((prev) => [...prev, newStudy]);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating study:", error);
      setError("Failed to create study. Please try again.");
    }
  };

  const handleUpdateStudy = async (studyData) => {
    try {
      setError("");
      const updatedStudy = await authAPI.updateStudy(
        user.id,
        editingStudy.id,
        studyData
      );
      setStudies((prev) =>
        prev.map((study) =>
          study.id === updatedStudy.id ? updatedStudy : study
        )
      );
      setEditingStudy(null);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating study:", error);
      setError("Failed to update study. Please try again.");
    }
  };

  const handleDeleteStudy = async (studyId) => {
    try {
      setError("");
      await authAPI.deleteStudy(user.id, studyId);
      setStudies((prev) => prev.filter((study) => study.id !== studyId));
    } catch (error) {
      console.error("Error deleting study:", error);
      setError("Failed to delete study. Please try again.");
    }
  };

  const handleOpenEditDialog = (study) => {
    setEditingStudy(study);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingStudy(null);
    setOpenDialog(false);
    setError("");
  };

  const columns = [
    {
      field: "institution",
      headerName: "Institution",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "degree",
      headerName: "Degree",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "year",
      headerName: "Year",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";

        return params.value.toString();
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
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
          onClick={() => handleDeleteStudy(params.row.id)}
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">My Studies</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Study
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={studies}
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
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "primary.light",
              color: "common.black",
            },
            "& .MuiDataGrid-menuIconButton": {
              color: "common.black",
            },
            "& .MuiDataGrid-toolbarContainer": {
              p: 2,
            },
          }}
        />
      </Paper>

      <StudyFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onCreate={handleCreateStudy}
        onUpdate={handleUpdateStudy}
        editingStudy={editingStudy}
      />
    </Box>
  );
}

export default Studies;
