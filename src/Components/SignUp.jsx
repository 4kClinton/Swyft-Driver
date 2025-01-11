import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Link } from "@mui/material";
import { Google, Twitter, GitHub } from "@mui/icons-material";
import "../Styles/Login.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Temporarily store data in sessionStorage
    const formData = { name, email, phoneNumber, password };
    sessionStorage.setItem("signupData", JSON.stringify(formData));

    // Navigate to verification page
    navigate("/verification");
  };

  return (
    <div className="form-container">
      <Typography className="title">Create an Account</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form className="form" onSubmit={handleSignUp}>
        <div className="input-group">
          <input
            placeholder="Name or Username"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Phone Number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number."
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="sign" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="social-message">
        <span className="line"></span>
        <span className="message">Or sign up with</span>
        <span className="line"></span>
      </div>
      {/* <div className="social-icons">
        <button className="icon">
          <Google />
        </button>
        <button className="icon">
          <Twitter />
        </button>
        <button className="icon">
          <GitHub />
        </button>
      </div> */}
      <div className="signup">
        <span>Already have an account? </span>
        <Link href="/">Log in</Link>
      </div>
    </div>
  );
};

export default SignUp;
