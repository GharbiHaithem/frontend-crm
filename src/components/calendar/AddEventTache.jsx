import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Modal,
  Typography,
  IconButton,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SelectChangeEvent } from "@mui/material";

const initialEventFormState = {
  type: "Tâche",
  title: "",
  description: "",
  start: null,
  end: null,
  participants: [],
};

const AddEventTache = ({ open, handleClose, onAddEvent }) => {
  const [eventFormData, setEventFormData] = useState(initialEventFormState);
  const [newParticipant, setNewParticipant] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    setEventFormData((prevData) => ({
      ...prevData,
      type: e.target.value,
    }));
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !eventFormData.participants.includes(newParticipant)) {
      setEventFormData((prevData) => ({
        ...prevData,
        participants: [...prevData.participants, newParticipant],
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
          width: 450,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          outline: "none",
        }}
      >
        <Card sx={{ border: "none", boxShadow: "none" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Planifier un événement
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* Champ Select pour choisir entre Tâche et Réunion */}
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={eventFormData.type}
                  onChange={handleTypeChange}
                  label="Type"
                >
                  <MenuItem value="Réunion">Réunion</MenuItem>
                  <MenuItem value="Tâche">Tâche</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={`Titre de la ${eventFormData.type}`}
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
                  label={`Début de la ${eventFormData.type}`}
                  value={eventFormData.start}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({ ...prevData, start: newValue }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required size="small" />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={`Fin de la ${eventFormData.type}`}
                  value={eventFormData.end}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({ ...prevData, end: newValue }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} fullWidth margin="normal" required size="small" />
                  )}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Ajouter des participants"
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

export default AddEventTache;
