import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItemButton, ListItemText, Typography, Box } from '@mui/material';

function SlideBar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 250, bgcolor: 'success.main', color: 'white' },
      }}
    >
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Inventory Control Panel
        </Typography>
      </Box>

      <List>
        {[
          { text: 'Home', path: '/inventoryPanel' },
          { text: 'Add Items', path: '/inventoryPanel/addItems' },
        ].map(({ text, path }) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              color: 'white',
              bgcolor: location.pathname === path ? 'rgba(255, 255, 255, 0.2)' : 'inherit',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
              '&.Mui-selected': { bgcolor: 'rgba(255, 255, 255, 0.3)', fontWeight: 'bold' },
            }}
          >
            <ListItemText primary={text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export default SlideBar;
