import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
} from "@mui/material";
import { authAPI } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object().shape({
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip code is required"),
  country: yup.string().required("Country is required"),
});

function AddressFormDialog({
  open,
  onClose,
  onCreate,
  onUpdate,
  editingAddress,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (editingAddress) {
      setValue("street", editingAddress.street);
      setValue("city", editingAddress.city);
      setValue("state", editingAddress.state);
      setValue("zip", editingAddress.zip);
      setValue("country", editingAddress.country);
    } else {
      reset();
    }
  }, [editingAddress, reset, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      if (editingAddress) {
        const updatedAddress = await authAPI.updateAddress(
          user.id,
          editingAddress.id,
          data
        );
        onUpdate(updatedAddress);
      } else {
        const newAddress = await authAPI.addAddress(user.id, data);
        onCreate(newAddress);
      }

      handleClose();
    } catch (err) {
      console.error("Error saving address:", err);
      setError(err.message || "Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingAddress ? "Edit Address" : "Add New Address"}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="street"
            label="Street"
            autoComplete="street-address"
            autoFocus
            {...register("street")}
            error={!!errors.street}
            helperText={errors.street?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="city"
            label="City"
            autoComplete="address-level2"
            {...register("city")}
            error={!!errors.city}
            helperText={errors.city?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="state"
            label="State/Province"
            autoComplete="address-level1"
            {...register("state")}
            error={!!errors.state}
            helperText={errors.state?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="zip"
            label="Zip/Postal Code"
            autoComplete="postal-code"
            {...register("zip")}
            error={!!errors.zip}
            helperText={errors.zip?.message}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="country"
            label="Country"
            autoComplete="country"
            {...register("country")}
            error={!!errors.country}
            helperText={errors.country?.message}
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
          {loading ? (
            <CircularProgress size={24} />
          ) : editingAddress ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddressFormDialog;
