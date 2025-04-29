import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs, Box } from "@mui/material";

const defaultTheme = createTheme();

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Individual, 2: Group (instead of Common)
  const navigate = useNavigate();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/userpromo/getpromotions"
      );
      console.log(response.data);  // Check the response data structure
      const formattedPromotions = response.data.map((promotion) => ({
        ...promotion,
        startDate: new Date(promotion.startDate).toLocaleDateString(),
        endDate: new Date(promotion.endDate).toLocaleDateString(),
      }));
      setPromotions(formattedPromotions);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  // Filter promotions based on search term and selected promotion type
  const filteredPromotionList = promotions
    .filter(
      (promotion, index, self) =>
        self.findIndex((p) => p.promotionName === promotion.promotionName) ===
        index
    )
    .filter((promotion) =>
      promotion.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((promotion) => {
      if (activeTab === 1) {
        return promotion.promotionType === "Individual"; // Show only Individual
      } else if (activeTab === 2) {
        return promotion.promotionType === "Group"; // Show only Group (formerly Common)
      }
      return true; // Show all promotions
    });

  const handleCardClick = (id) => {
    navigate(`/marketingPanel/promotion/${id}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue); // Update active tab
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{
            textAlign: "center",
            marginTop: "50px",
            color: defaultTheme.palette.success.main,
          }}
        >
          Special Offers
        </Typography>
      </motion.div>

      {/* Tab for filter selection (All, Individual, Group) */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Box sx={{ width: "100%", marginBottom: "20px" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            aria-label="promotion type tabs"
          >
            <Tab label="All" />
            <Tab label="Individual" />
            <Tab label="Group" /> {/* Updated tab label */}
          </Tabs>
        </Box>
      </motion.div>

      {/* Display promotions based on the selected filter */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {filteredPromotionList.map((promotion) => (
            <motion.div
              key={promotion._id}
              onClick={() => handleCardClick(promotion._id)} // Navigate to detail
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ margin: "10px", cursor: "pointer" }}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  style={{
                    width: "300px",
                    marginTop: "70px",
                    border: `1px solid ${defaultTheme.palette.success.main}`,
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{
                        color: defaultTheme.palette.success.main,
                      }}
                    >
                      {promotion.promotionName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{ width: "100%" }}
                    >
                      {promotion.description}
                    </Typography>
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={`data:image/png;base64,${promotion.imageBase64}`}
                        alt="Promotion"
                        style={{
                          maxWidth: "50%",
                          height: "100%",
                          borderRadius: "15px",
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </ThemeProvider>
  );
}
