// src/Components/Profile.jsx

import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BottomNav from "./BottomNav.jsx";

const Profile = () => {
  // Mock user profile data
  const mockProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "0796-123-456",
    joinDate: "2023-01-15",
  };

  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Replace with actual profile data fetching in the future
    setProfile(mockProfile);
  }, []);

  return (
    <div style={{ padding: "16px", display: "flex", justifyContent: "center" }}>
      <Card style={{ maxWidth: 400, width: "100%" }}>
        <CardContent
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar style={{ marginBottom: "16px", backgroundColor: "#FFA500" }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h5">{profile.name}</Typography>
          <Typography variant="body1" color="textSecondary">
            Email: {profile.email}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Phone: {profile.phone}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Joined: {profile.joinDate}
          </Typography>
        </CardContent>
      </Card>
      {/* <BottomNav /> */}
    </div>
  );
};

export default Profile;
