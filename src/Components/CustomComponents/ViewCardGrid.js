import React from "react";
import { Button, Tabs, Tab, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import AdjustIcon from "@mui/icons-material/Tune";

const InventoryItemView = () => {
  return (
    <Box display="flex" p={2}>
      {/* Sidebar */}
      <Box width="20%" borderRight="1px solid #ddd" p={2}>
        <Typography variant="h6">All Items</Typography>
        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          + New
        </Button>
        <Box mt={3}>
          <Typography variant="body1" fontWeight="bold">
            Cements
          </Typography>
          <Typography variant="body2">Rs. 150.00</Typography>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box flex={1} p={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Cements</Typography>
          <Button variant="contained" startIcon={<AdjustIcon />}>Adjust Plot</Button>
        </Box>
        
        {/* Tabs */}
        <Tabs value={0} textColor="primary" indicatorColor="primary">
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="History" />
        </Tabs>
        
        {/* Details Section */}
        <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1">Item Type: Inventory Items</Typography>
            <Typography variant="subtitle1">Unit: Box</Typography>
            <Typography variant="subtitle1">Dimensions: 1 cm x 1 cm x 1 cm</Typography>
            <Typography variant="subtitle1">Weight: 250 kg</Typography>
            <Typography variant="subtitle1">Inventory Valuation: FIFO (First In First Out)</Typography>
            <Typography variant="subtitle1">Cost Price: Rs. 100.00</Typography>
          </CardContent>
        </Card>

        {/* Image Preview */}
        <Card sx={{ width: 200, mt: 2 }}>
          <CardMedia
            component="img"
            height="100"
            image="/placeholder.jpg"
            alt="Product Preview"
          />
          <CardContent>
            <Typography variant="caption">Primary</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default InventoryItemView;
