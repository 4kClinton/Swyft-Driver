import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import "../Styles/Rides.css"; // Import the CSS file

const RidesHistory = () => {
  const mockRides = [
    { id: 1, destination: "Nairobi CBD", date: "2024-10-01", fare: "Ksh 500" },
    { id: 2, destination: "Westlands", date: "2024-10-10", fare: "Ksh 750" },
    { id: 3, destination: "Kilimani", date: "2024-10-15", fare: "Ksh 600" },
    { id: 4, destination: "Karen", date: "2024-10-20", fare: "Ksh 800" },
  ];

  const [rides, setRides] = useState([]);

  useEffect(() => {
    setRides(mockRides);
  }, []);

  return (
    <div className="rides-history-container">
      <Typography className="rides-history-title">Rides History</Typography>
      <List className="rides-history-list">
        {rides.map((ride) => (
          <React.Fragment key={ride.id}>
            <ListItem className="rides-history-list-item">
              <ListItemIcon>
                <DriveEtaIcon className="rides-history-icon" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography className="rides-history-primary">
                    {ride.destination}
                  </Typography>
                }
                secondary={
                  <Typography className="rides-history-secondary">
                    Date: {ride.date} | Fare: {ride.fare}
                  </Typography>
                }
              />
            </ListItem>
            <Divider className="rides-history-divider" />
          </React.Fragment>
        ))}
      </List>
      {/* Uncomment if BottomNav is needed */}
      {/* <BottomNav /> */}
    </div>
  );
};

export default RidesHistory;
