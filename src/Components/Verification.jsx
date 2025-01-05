import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import "../Styles/Login.css";
import { addUser } from "../Redux/Reducers/UserSlice";
import { useDispatch } from "react-redux";

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve data from sessionStorage
  const storedData = JSON.parse(sessionStorage.getItem("signupData")) || {};
  const { name, phoneNumber, email, password } = storedData;

  // Retrieve uniqueId from sessionStorage or generate if not present

  const [carType, setCarType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) {
      // Redirect to signup if no data is in sessionStorage
      navigate("/signup");
    }
  }, [name, navigate]);

  const verifyAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://swyft-backend-client-eta.vercel.app/driver/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
           
            name,
            phone: phoneNumber,
            email,
            carType,
            password,
            licenseNumber,
            idNumber,
            licensePlate,
          }),
        }
      );

      // Log the request body for debugging
      console.log({
        
        name,
        phone: phoneNumber,
        email,
        carType,
        password,
        licenseNumber,
        idNumber,
        licensePlate,
      });

      // Check response
      const responseData = await response.json();

      console.log(responseData); // Log the response from the server

      if (!response.ok) {
        throw new Error(
          `Verification failed: ${responseData.message || "Please try again."}`
        );
      }
      const { access_token, user, message } = responseData;

      sessionStorage.setItem("authToken", access_token);
      dispatch(addUser(user));
      sessionStorage.setItem("message", message || "Driver created successful!");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("status", "driver created!");
      // Successfully verified, redirect to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("An error occurred during verification:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-component">
      <Box className="verification-container">
        <SecurityIcon
          style={{ fontSize: "100px", color: "#18b700", marginBottom: "16px" }}
        />
        <header className="verification-header">
          {`Let’s verify your account, ${name}!`}
        </header>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={verifyAccount}>
          <div className="input-group">
            <div className="car-type">
              <label htmlFor="carType" className="car-type-label">
                Car Type
              </label>
              <div className="car-type-select">
                <select
                  id="carType"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  required
                  className="car-type-dropdown"
                >
                  <option value="" disabled>
                    Select Car Type
                  </option>
                  <option value="pickup">Pickup</option>
                  <option value="miniTruck">Mini Truck</option>
                  <option value="lorry">Lorry</option>
                  <option value="flatbed">Flatbed</option>
                </select>
              </div>
            </div>

            <input
              placeholder="Driving License Number"
              className="login-input"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              placeholder="ID Number"
              className="login-input"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              placeholder="License Plate Number"
              className="login-input"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
          </div>
          <Button
            variant="contained"
            type="submit"
            className="verify-button"
            sx={{ mt: 2, backgroundColor: "#18b700", fontWeight: "bold" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default Verification;