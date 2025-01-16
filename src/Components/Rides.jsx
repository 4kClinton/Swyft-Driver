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
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    fetch("https://swyft-backend-client-nine.vercel.app/rides", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rides history");
        }
        return response.json();
      })
      .then((data) => {
        setRides(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div className="rides-history-container">
      <Typography className="rides-history-title">Rides History</Typography>
      <List
        className="rides-history-list"
        sx={{
          paddingBottom: 0,
        }}
      >
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
