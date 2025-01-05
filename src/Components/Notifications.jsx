import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications"; // Icon for each notification item
import "../Styles/Rides.css"; // Import shared styles

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
    // Simulating fetching data from a database
    setNotifications(mockNotifications);
  }, []);

  return (
    <div
      className="rides-history-container"
      sx={{
        paddingBottom: 0,
      }}
    >
      <header className="rides-history-title">Notifications</header>
      <List className="rides-history-list">
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem className="rides-history-list-item">
              <ListItemIcon>
                <NotificationsIcon className="rides-history-icon" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography className="rides-history-primary">
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography className="rides-history-secondary">
                    Date: {notification.date}
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

export default Notifications;
