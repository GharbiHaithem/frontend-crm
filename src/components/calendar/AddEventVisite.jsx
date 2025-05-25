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
  participants: [],
  agenda: "",
};

const AddEventVisite = ({ open, handleClose, onAddEvent }) => {
  const [eventFormData, setEventFormData] = useState(initialEventFormState);
  const [newParticipant, setNewParticipant] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() !== "") {
      setEventFormData((prevData) => ({
        ...prevData,
        participants: [...prevData.participants, newParticipant.trim()],
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
    if (!eventFormData.title.trim()) newErrors.title = "Titre requis";
    if (!eventFormData.description.trim()) newErrors.description = "Description requise";
    if (!eventFormData.start) newErrors.start = "Date de début requise";
    if (!eventFormData.end) newErrors.end = "Date de fin requise";
    if (!eventFormData.location.trim()) newErrors.location = "Lieu requis";
    if (eventFormData.participants.length === 0)
      newErrors.participants = "Au moins un fournisseur est requis";
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
              Planifier une visite
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Titre de la visite"
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
                  label="Début de la visite"
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
                  label="Fin de la visite"
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
                label="Lieu"
                name="location"
                value={eventFormData.location}
                onChange={handleInputChange}
                margin="normal"
                size="small"
                error={!!errors.location}
                helperText={errors.location}
              />

              <TextField
                fullWidth
                label="Ajouter des fournisseurs"
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

export default AddEventVisite;
