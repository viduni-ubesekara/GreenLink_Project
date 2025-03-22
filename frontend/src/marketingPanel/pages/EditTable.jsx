import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

const EditPromotionDialog = ({ promotion, onSave, onClose }) => {
  const [editedPromotion, setEditedPromotion] = useState({ ...promotion });
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus the first input when dialog opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPromotion((prevPromotion) => ({
      ...prevPromotion,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/userpromo/updatepromotion/${promotion._id}`,
        editedPromotion
      );
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/userpromo/delete/${promotion._id}`
      );
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog 
        open={true} 
        onClose={handleCancel} 
        maxWidth="md" 
        fullWidth
        aria-labelledby="edit-promotion-dialog-title"
        aria-describedby="edit-promotion-dialog-description"
        ref={dialogRef}
      >
        <DialogTitle 
          id="edit-promotion-dialog-title"
          sx={{ color: defaultTheme.palette.success.main }}
        >
          Edit Promotion
        </DialogTitle>
        <DialogContent id="edit-promotion-dialog-description">
          <TextField
            label="Promotion Name"
            name="promotionName"
            value={editedPromotion.promotionName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            inputRef={firstInputRef}
          />
          <TextField
            label="Promotion Key"
            name="promotionKey"
            value={editedPromotion.promotionKey}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={editedPromotion.startDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={editedPromotion.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="User Email"
            name="userEmail"
            value={editedPromotion.userEmail}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number"
            name="number"
            value={editedPromotion.number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Promotion Type"
            name="promotionType"
            select
            value={editedPromotion.promotionType}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Promotion">Promotion</MenuItem>
            <MenuItem value="Discount">Discount</MenuItem>
          </TextField>
          <TextField
            label="Description"
            name="description"
            value={editedPromotion.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={handleCancel} 
            variant="outlined" 
            color="inherit"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="success"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default EditPromotionDialog;
