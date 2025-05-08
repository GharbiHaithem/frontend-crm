import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Modal,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";

const initialEventFormState = {
  title: "",
  description: "",
  start: null,
  end: null,
  location: "",
  fournisseur: "",
  participants: [],
  agenda: "",
};

const AddEventReunion = ({ open, handleClose, onAddEvent }) => {
  const [eventFormData, setEventFormData] = useState(initialEventFormState);
  const [newParticipant, setNewParticipant] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== "") {
      setEventFormData((prevData) => ({
        ...prevData,
        participants: [...prevData.participants, newParticipant.trim()],
      }));
      setNewParticipant("");
    }
  };

  const handleRemoveParticipant = (participant) => {
    setEventFormData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((p) => p !== participant),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(eventFormData);
    setEventFormData(initialEventFormState);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 1,
          outline: "none",
        }}
      >
        <Card sx={{ border: "none", boxShadow: "none" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Planifier une réunion
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Titre de la réunion"
                name="title"
                value={eventFormData.title}
                onChange={handleInputChange}
                margin="normal"
                required
                size="small"
              />

              <TextField
                fullWidth
                label="Description"
                name="description"
                value={eventFormData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={2}
                size="small"
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Début de la réunion"
                  value={eventFormData.start}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({
                      ...prevData,
                      start: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required size="small" />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Fin de la réunion"
                  value={eventFormData.end}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({
                      ...prevData,
                      end: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required size="small" />
                  )}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Fournisseur"
                name="fournisseur"
                value={eventFormData.fournisseur}
                onChange={handleInputChange}
                margin="normal"
                required
                size="small"
              />

              <TextField
                fullWidth
                label="Ajouter des participants Clients"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                margin="normal"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddParticipant} size="small">
                        <PersonAddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {eventFormData.participants.map((participant, index) => (
                  <Chip
                    key={index}
                    label={participant}
                    onDelete={() => handleRemoveParticipant(participant)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                  />
                ))}
              </Box>

              <TextField
                fullWidth
                label="Ordre du jour"
                name="agenda"
                value={eventFormData.agenda}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={3}
                size="small"
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
                <Button variant="outlined" onClick={handleClose} size="small">
                  Annuler
                </Button>
                <Button type="submit" variant="contained" color="primary" size="small">
                  Enregistrer
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default AddEventReunion;
