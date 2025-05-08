import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { HexColorPicker } from "react-colorful";

export const AddTodoModal = ({ open, handleClose, todos, setTodos }) => {
  const [color, setColor] = useState("#b32aa9");
  const [title, setTitle] = useState("");

  const onAddTodo = () => {
    if (!title.trim()) return;
    
    const newTodo = {
      _id: generateId(),
      color,
      title: title.trim(),
    };
    
    setTodos([...todos, newTodo]);
    setTitle("");
    setColor("#b32aa9");
  };

  const onDeleteTodo = (_id) => {
    setTodos(todos.filter((todo) => todo._id !== _id));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add todo</DialogTitle>
      <DialogContent>
        <DialogContentText>Create todos to add to your Calendar.</DialogContentText>
        <Box>
          <TextField
            name="title"
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            sx={{ mb: 6 }}
            required
            variant="outlined"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box
              sx={{ 
                height: 40, 
                width: 40, 
                borderRadius: 1,
                ml: 2,
                border: "1px solid #ccc"
              }}
              style={{ backgroundColor: color }}
            />
          </Box>
          <Box>
            <List sx={{ marginTop: 3 }}>
              {todos.map((todo) => (
                <ListItem
                  key={todo._id}
                  secondaryAction={
                    <IconButton 
                      onClick={() => onDeleteTodo(todo._id)} 
                      color="error" 
                      edge="end"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{ 
                      height: 40, 
                      width: 40, 
                      borderRadius: 1, 
                      marginRight: 1,
                      border: "1px solid #ccc"
                    }}
                    style={{ backgroundColor: todo.color }}
                  />
                  <ListItemText primary={todo.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ marginTop: 2 }}>
        <Button 
          sx={{ marginRight: 2 }} 
          variant="contained" 
          color="error" 
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          onClick={onAddTodo}
          disabled={!title.trim()}
          variant="contained"
          color="primary"
          sx={{
            marginRight: 2,
            backgroundColor: "#4caf50",
            color: "white",
            "&:hover": { backgroundColor: "#43a047" },
            "&.Mui-disabled": { backgroundColor: "#e0e0e0" },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Fonction generateId à placer dans un fichier séparé (utils/generateId.js)
export const generateId = () => (Math.floor(Math.random() * 10000) + 1).toString();