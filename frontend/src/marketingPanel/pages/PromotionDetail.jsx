import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const PromotionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use useNavigate hook
  const [promotion, setPromotion] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedPromotion, setEditedPromotion] = useState({
    promotionName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const fetchPromotion = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/userpromo/${id}`);
      setPromotion(res.data);
      setEditedPromotion({
        promotionName: res.data.promotionName,
        description: res.data.description,
        startDate: res.data.startDate?.slice(0, 10),
        endDate: res.data.endDate?.slice(0, 10),
      });
    } catch (err) {
      console.error("Error fetching promotion:", err);
    }
  };

  const handleEditSubmit = async () => {
    try {
      const formattedPayload = {
        ...editedPromotion,
        startDate: new Date(editedPromotion.startDate).toISOString(),
        endDate: new Date(editedPromotion.endDate).toISOString(),
      };

      const res = await axios.put(
        `http://localhost:5000/api/userpromo/updatepromotion/${id}`,
        formattedPayload
      );

      setPromotion(res.data);
      setOpenEditModal(false);
    } catch (err) {
      console.error("Error updating promotion:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/userpromo/delete/${id}`);
      navigate("/promotions"); // Use navigate instead of history.push
    } catch (err) {
      console.error("Error deleting promotion:", err);
    }
  };

  if (!promotion) return <div>Loading...</div>;

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        marginTop: "50px",
        padding: "20px",
        border: "1px solid #4caf50",
        borderRadius: "15px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Typography variant="h4" gutterBottom color="success.main">
          {promotion.promotionName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {promotion.description}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Start Date:</strong> {new Date(promotion.startDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>End Date:</strong> {new Date(promotion.endDate).toLocaleDateString()}
        </Typography>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={`data:image/png;base64,${promotion.imageBase64}`}
            alt="Promotion"
            style={{
              maxWidth: "80%",
              height: "auto",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />
        </div>

        <Button variant="outlined" color="success" onClick={() => setOpenEditModal(true)}>
          Edit Promotion
        </Button>
      </CardContent>

      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <DialogTitle>Edit Promotion</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Promotion Name"
            fullWidth
            value={editedPromotion.promotionName}
            onChange={(e) =>
              setEditedPromotion({ ...editedPromotion, promotionName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            value={editedPromotion.description}
            onChange={(e) =>
              setEditedPromotion({ ...editedPromotion, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={editedPromotion.startDate}
            onChange={(e) =>
              setEditedPromotion({ ...editedPromotion, startDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            value={editedPromotion.endDate}
            onChange={(e) =>
              setEditedPromotion({ ...editedPromotion, endDate: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditModal(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="success" variant="contained">
            Save
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PromotionDetails;
