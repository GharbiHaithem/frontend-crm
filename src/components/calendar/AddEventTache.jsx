import React, { useEffect, useState } from "react";
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
  FormHelperText,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const AddEventTache = ({ open, handleClose, onAddEvent }) => {
  const initialEventFormState = {
  type: "réunion" ,
  title: "",
  description: "",
  start: null,
  end: null,
  participants: [],
};
  const [eventFormData, setEventFormData] = useState(initialEventFormState);
  const [newParticipant, setNewParticipant] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTypeChange = (e) => {
    console.log( e.target.value)
    setEventFormData((prevData) => ({
      ...prevData,
      type: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, type: "" }));
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !eventFormData.participants.includes(newParticipant)) {
      setEventFormData((prevData) => ({
        ...prevData,
        participants: [...prevData.participants, newParticipant],
      }));
      setNewParticipant("");
      setErrors((prev) => ({ ...prev, participants: "" }));
    }
  };

  const handleRemoveParticipant = (participant) => {
    setEventFormData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((p) => p !== participant),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventFormData.type) newErrors.type = "Type requis";
    if (!eventFormData.title.trim()) newErrors.title = "Titre requis";
    if (!eventFormData.description.trim()) newErrors.description = "Description requise";
    if (!eventFormData.start) newErrors.start = "Date de début requise";
    if (!eventFormData.end) newErrors.end = "Date de fin requise";
    if (
      eventFormData.start &&
      eventFormData.end &&
      new Date(eventFormData.end) <= new Date(eventFormData.start)
    ) {
      newErrors.end = "La date de fin doit être postérieure à la date de début";
    }
    if (eventFormData.participants.length === 0)
      newErrors.participants = "Au moins un participant est requis";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onAddEvent(eventFormData);
    setEventFormData(initialEventFormState);
    setErrors({});
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
              <FormControl fullWidth margin="normal" size="small" error={!!errors.type}>
                <InputLabel>Type</InputLabel>
                <Select value={eventFormData.type} onChange={handleTypeChange} label="Type">
                  <MenuItem value="réunion">Réunion</MenuItem>
                  <MenuItem value="tâche">Tâche</MenuItem>
                </Select>
                <FormHelperText>{errors.type}</FormHelperText>
              </FormControl>

              <TextField
                fullWidth
                label={`Titre de la ${eventFormData.type}`}
                name="title"
                value={eventFormData.title}
                onChange={handleInputChange}
                margin="normal"
                size="small"
                error={!!errors.title}
                helperText={errors.title}
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
                error={!!errors.description}
                helperText={errors.description}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={`Début de la ${eventFormData.type}`}
                  value={eventFormData.start}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({
                      ...prevData,
                      start: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!errors.start}
                      helperText={errors.start}
                    />
                  )}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={`Fin de la ${eventFormData.type}`}
                  value={eventFormData.end}
                  onChange={(newValue) =>
                    setEventFormData((prevData) => ({
                      ...prevData,
                      end: newValue,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!errors.end}
                      helperText={errors.end}
                    />
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
              {errors.participants && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.participants}
                </Typography>
              )}

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
