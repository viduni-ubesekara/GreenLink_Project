import React from "react";
import { Typography, Container, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";

// Theme with Success Green
const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32", // Success Green
    },
  },
});

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const buttonVariants = {
  hover: { scale: 1.1, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function Promotion() {
  return (
    <ThemeProvider theme={theme}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Heading */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            marginTop: "120px",
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "primary.main",
          }}
        >
          Digital Marketing Control Panel
        </Typography>

        {/* Button Container with Motion */}
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            marginTop: "50px",
            flexWrap: "wrap", // Responsive layout
          }}
        >
          {/* New Promotions Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              color="primary"
              href="/marketingPanel/promotionmain"
              sx={{
                padding: "15px 35px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              New Promotions
            </Button>
          </motion.div>

          {/* Show Promotions Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              color="primary"
              href="/marketingPanel/promotionTable"
              sx={{
                padding: "15px 35px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              Show Promotions
            </Button>
          </motion.div>

          {/* Shop Promotions Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              color="primary"
              href="/marketingPanel/promotionview"
              sx={{
                padding: "15px 35px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
            >
              Promotion Dashboard
            </Button>
          </motion.div>

          {/* Promotion dashboard Button */}
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="contained"
              color="primary"
              href="/marketingPanel/home"
              sx={{
                padding: "15px 35px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              }}
            >Shop Promotions
               
            </Button>
          </motion.div>
        </Container>
      </motion.div>
    </ThemeProvider>
  );
}
