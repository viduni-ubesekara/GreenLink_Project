import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Alert, AlertTitle, Box } from '@mui/material';
import ItemDetailsDisplay from '../Components/ItemDetailsDisplay';
import { motion } from 'framer-motion';

function Home() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [lowStockItems, setLowStockItems] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  const lowStockThreshold = 50;

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch('/inventoryPanel');
      const json = await response.json();

      if (response.ok) {
        setItems(json);
        checkLowStock(json);
      }
    };
    fetchItems();
  }, []);

  // 👇 Hide "Remove" button after rendering
  useEffect(() => {
    const buttons = document.querySelectorAll('.hide-remove-btn button');
    buttons.forEach((btn) => {
      if (btn.textContent.trim().toLowerCase() === 'remove') {
        btn.style.display = 'none';
      }
    });
  }, [items, showLowStock, query]);

  const checkLowStock = (items) => {
    const lowStock = items.filter(item => item.stockCount < lowStockThreshold);
    setLowStockItems(lowStock);
  };

  const filteredItems = items.filter((item) =>
    query === '' || item.itemName.toLowerCase().includes(query.toLowerCase())
  );

  const generateCSV = (data, filename) => {
    const csvContent = [
      ['Item ID', 'Item Name', 'Brand', 'Price', 'Stock Count', 'Added Date'],
      ...data.map((item) => [item.itemID, item.itemName, item.itemBrand, item.itemPrice, item.stockCount, item.createdAt])
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TextField
            label="Search Items"
            variant="outlined"
            color='success'
            fullWidth
            sx={{
              mt: 3,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '40px',
                borderColor: 'green',
                '&:hover': {
                  borderColor: 'green',
                },
                '&.Mui-focused': {
                  borderColor: 'green',
                  outline: 'green',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'green',
                '&.Mui-focused': {
                  color: 'green',
                },
              },
            }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            onClick={() => generateCSV(showLowStock ? lowStockItems : filteredItems, showLowStock ? 'low_stock_inventory_report.csv' : 'full_inventory_report.csv')}
            variant="contained"
            color="success"
            sx={{ mb: 3 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Generate {showLowStock ? 'Low Stock' : 'Full'} Report
          </Button>
        </motion.div>

        <Box>
          {(showLowStock ? lowStockItems : filteredItems).map((item) => (
            <motion.div
              key={item.itemID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Box
                  className="hide-remove-btn" // 👈 Target this class to hide button inside
                  sx={{
                    border: item.stockCount < lowStockThreshold ? '2px solid red' : 'none',
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                    cursor: 'pointer',
                  }}
                >
                  <ItemDetailsDisplay item={item} />
                  {item.stockCount < lowStockThreshold && (
                    <Box component="span" sx={{ color: 'red', fontWeight: 'bold' }}>
                      Low Stock!
                    </Box>
                  )}
                </Box>
              </motion.div>
            </motion.div>
          ))}
        </Box>
      </Container>
    </>
  );
}

export default Home;
