import React from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography
} from "@mui/material"

const EventInfoModal = ({ open, handleClose, onDeleteEvent, currentEvent }) => {
  const onClose = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography sx={{ fontSize: 14, marginTop: 3 }} color="text.secondary" gutterBottom>
            {currentEvent?.description}
          </Typography>
        </DialogContentText>
        <Box component="form" />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Annuler
        </Button>
        <Button color="info" onClick={onDeleteEvent}>
         Supprimer l'événement
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventInfoModal
