// src/Components/Notifications.jsx

import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import BottomNav from "./BottomNav.jsx"
import NotificationsIcon from "@mui/icons-material/Notifications"; // Icon for each notification item

const Notifications = () => {
  // Mock data for notifications
  const mockNotifications = [
    { id: 1, message: "Your ride is on the way!", date: "2024-10-28" },
    { id: 2, message: "Fare discount available for you!", date: "2024-10-25" },
    { id: 3, message: "New app update available!", date: "2024-10-22" },
    { id: 4, message: "Check out our new services!", date: "2024-10-18" },
  ];

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Replace with an actual database call in the future
    setNotifications(mockNotifications);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={`Date: ${notification.date}`}
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

export default Notifications;
