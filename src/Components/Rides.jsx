// src/Components/RidesHistory.jsx

import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import BottomNav from "./BottomNav.jsx";
import DriveEtaIcon from "@mui/icons-material/DriveEta"; // Icon for each ride item

const RidesHistory = () => {
  // Mock data for past rides
  const mockRides = [
    { id: 1, destination: "Nairobi CBD", date: "2024-10-01", fare: "Ksh 500" },
    { id: 2, destination: "Westlands", date: "2024-10-10", fare: "Ksh 750" },
    { id: 3, destination: "Kilimani", date: "2024-10-15", fare: "Ksh 600" },
    { id: 4, destination: "Karen", date: "2024-10-20", fare: "Ksh 800" },
    // Add more mock rides if needed
  ];

  const [rides, setRides] = useState([]);

  // Simulating fetching data from a database
  useEffect(() => {
    // Replace this with an actual database call in the future
    setRides(mockRides);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Rides History
      </Typography>
      <List>
        {rides.map((ride) => (
          <React.Fragment key={ride.id}>
            <ListItem>
              <ListItemIcon>
                <DriveEtaIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${ride.destination}`}
                secondary={`Date: ${ride.date} | Fare: ${ride.fare}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {/* <BottomNav /> */}
    </div>
  );
};

export default RidesHistory;
