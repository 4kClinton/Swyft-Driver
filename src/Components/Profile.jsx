import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import BottomNav from "./BottomNav.jsx";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Profile data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "https://swyft-backend-client-nine.vercel.app/user/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Assumes an auth token is stored in localStorage
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

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
            Joined: {new Date(profile.joinDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
      {/* Uncomment BottomNav if required */}
      {/* <BottomNav /> */}
    </div>
  );
};

export default Profile;
