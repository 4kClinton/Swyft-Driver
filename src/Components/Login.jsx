import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { messaging } from "../../firebase"; // Ensure you import Firebase messaging setup
import { getToken, onMessage } from "firebase/messaging";
import { addUser } from "../Redux/Reducers/UserSlice";
import "../Styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState(""); // State for storing FCM token
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const vapid_key = import.meta.env.VITE_VAPID_KEY;

  useEffect(() => {
    if (user.id) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Request Notification Permissions and Retrieve FCM Token
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        if (!("Notification" in window)) {
          console.error("Notification API is not supported by this browser.");
          return;
        }

        const permissionResult = await Notification.requestPermission();
        if (permissionResult === "granted") {
          const token = await getToken(messaging, {
            vapidKey: vapid_key, // Replace with your VAPID key
          });
          if (token) {
            console.log("FCM Token:", token);
            setFcmToken(token);
          } else {
            console.error("Failed to retrieve FCM Token.");
          }
        } else {
          console.error("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error requesting notification permission or retrieving token:", error);
      }
    };

    requestNotificationPermission();

    // Listen for incoming foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in the foreground:", payload);
    });

    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up FCM listener");
      unsubscribe();
    };
  }, []);

  const logIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Convert email to lowercase
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(
        "https://swyft-backend-client-nine.vercel.app/driver/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email: sanitizedEmail, password, fcm_token:fcmToken }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const { access_token, user, message } = data;

        sessionStorage.setItem('message', message || 'Login successful!');
        sessionStorage.setItem('authToken', access_token);
        dispatch(addUser(user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-component">
      <Box className="login-container">
        <header className="login-header">Log in to Swyft</header>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={logIn} className="login-form">
          <input
            placeholder="Email or Username"
            type="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link href="#" variant="body2" className="forgot-password">
            Forgot password?
          </Link>
          <Button
            variant="contained"
            type="submit"
            className="login-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Log In"}
          </Button>
        </form>
        <Button
          onClick={() => navigate("/signup")}
          variant="text"
          className="create-account"
          align="center"
          sx={{ mt: 2, color: "#18b700", fontWeight: "bold" }}
        >
          Create account
        </Button>
      </Box>
    </div>
  );
};

export default Login;
