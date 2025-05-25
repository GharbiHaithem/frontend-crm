import { useState } from "react";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Autocomplete,
  Box,
} from "@mui/material";

const AddEventModal = ({
  open,
  handleClose,
  eventFormData,
  setEventFormData,
  onAddEvent,
  todos,
}) => {
  const { description } = eventFormData;
  const [error, setError] = useState("");

  const onClose = () => {
    setError(""); // reset erreur
    handleClose();
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setEventFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Réinitialiser l’erreur en live
    if (name === "description" && value.trim() !== "") {
      setError("");
    }
  };

  const handleTodoChange = (e, value) => {
    setEventFormData((prevState) => ({
      ...prevState,
      todoId: value?._id,
    }));
  };

const handleAdd = (e) => {
  e.preventDefault(); // ✔️ maintenant e est bien défini
  if (!description || description.trim() === "") {
    setError("La description est obligatoire");
    return;
  }

  setError("");
  onAddEvent(e); // e est transmis au parent
};

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un événement</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pour ajouter un événement, veuillez remplir les informations ci-dessous.
        </DialogContentText>
        <Box component="form">
          <TextField
            name="description"
            value={description}
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChange}
            error={!!error}
            helperText={error}
          />

          <Autocomplete
            onChange={handleTodoChange}
            disablePortal
            id="combo-box-demo"
            options={todos}
            sx={{ marginTop: 4 }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label="Faire" />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Annuler
        </Button>
       <Button color="success" onClick={(e) => handleAdd(e)}>
  Ajouter
</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEventModal;
