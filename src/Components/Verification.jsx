import { useState, useEffect, createRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import '../Styles/Verification.css';
import { addUser } from '../Redux/Reducers/UserSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client – replace these with your own values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve signup data from cookies
  const storedData = JSON.parse(Cookies.get('signupData')) || {};
  const { name, phoneNumber, email, password } = storedData;

  // Unique driver ID
  const [id] = useState(() => uuidv4());
  const [carType, setCarType] = useState('');
  const [licenseNumber] = useState(''); // Not used if not required
  const [licensePlate, setLicensePlate] = useState(''); // Car Number Plate
  const [idNumber, setIdNumber] = useState(''); // New state for ID Number

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // File states for Driver Documents
  const [drivingLicenseFile, setDrivingLicenseFile] = useState(null);
  const [nationalIDFrontFile, setNationalIDFrontFile] = useState(null);
  const [nationalIDBackFile, setNationalIDBackFile] = useState(null);
  const [psvBadgeFile, setPsvBadgeFile] = useState(null);

  // File states for Vehicle Documents
  const [vehicleRegistrationFile, setVehicleRegistrationFile] = useState(null);
  const [vehiclePictureFrontFile, setVehiclePictureFrontFile] = useState(null);
  const [vehiclePictureBackFile, setVehiclePictureBackFile] = useState(null);
  const [psvCarInsuranceFile, setPsvCarInsuranceFile] = useState(null);
  const [inspectionReportFile, setInspectionReportFile] = useState(null);

  // Create refs for text inputs, wrapped in useMemo for stable references
  const inputRefs = useMemo(
    () => ({
      carType: createRef(),
      licenseNumber: createRef(),
      licensePlate: createRef(),
    }),
    []
  );

  useEffect(() => {
    const handleFocus = (e) => {
      e.target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    };

    Object.values(inputRefs).forEach((inputRef) => {
      if (inputRef.current) {
        inputRef.current.addEventListener('focus', handleFocus);
      }
    });

    return () => {
      Object.values(inputRefs).forEach((inputRef) => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('focus', handleFocus);
        }
      });
    };
  }, [inputRefs]);

  useEffect(() => {
    if (!name) {
      navigate('/signup');
    }
  }, [name]);

  // Helper to upload a file and return its public URL
  const uploadFile = async (file, fileName) => {
    if (!file) return null;
    const filePath = `${id}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);
    if (uploadError) {
      throw new Error(`Upload failed for ${fileName}: ${uploadError.message}`);
    }
    const { publicURL } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    return publicURL;
  };

  const verifyAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const sanitizedEmail = email.trim().toLowerCase();

    // Debug: log the idNumber value before submission
    console.log('ID Number:', idNumber);

    try {
      // Upload driver document files
      const drivingLicenseURL = await uploadFile(
        drivingLicenseFile,
        'drivingLicense.jpg'
      );
      const nationalIDFrontURL = await uploadFile(
        nationalIDFrontFile,
        'nationalID_front.jpg'
      );
      const nationalIDBackURL = await uploadFile(
        nationalIDBackFile,
        'nationalID_back.jpg'
      );
      const psvBadgeURL = await uploadFile(psvBadgeFile, 'psvBadge.jpg');

      // Upload vehicle document files
      const vehicleRegistrationURL = await uploadFile(
        vehicleRegistrationFile,
        'vehicleRegistration.jpg'
      );
      const vehiclePictureFrontURL = await uploadFile(
        vehiclePictureFrontFile,
        'vehiclePicture_front.jpg'
      );
      const vehiclePictureBackURL = await uploadFile(
        vehiclePictureBackFile,
        'vehiclePicture_back.jpg'
      );
      const psvCarInsuranceURL = await uploadFile(
        psvCarInsuranceFile,
        'psvCarInsurance.jpg'
      );
      const inspectionReportURL = await uploadFile(
        inspectionReportFile,
        'inspectionReport.jpg'
      );

      // Send collected data to backend for KYC verification, including id_number
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            name,
            phone: phoneNumber,
            email: sanitizedEmail,
            carType,
            password,
            licenseNumber,
            licensePlate,
            id_number: idNumber, // Include the driver's ID number
            documents: {
              drivingLicense: drivingLicenseURL,
              nationalIDFront: nationalIDFrontURL,
              nationalIDBack: nationalIDBackURL,
              psvBadge: psvBadgeURL,
              vehicleRegistration: vehicleRegistrationURL,
              vehiclePictureFront: vehiclePictureFrontURL,
              vehiclePictureBack: vehiclePictureBackURL,
              psvCarInsurance: psvCarInsuranceURL,
              inspectionReport: inspectionReportURL,
            },
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `Verification failed: ${responseData.error || 'Please try again.'}`
        );
      }

      const { access_token, user, message } = responseData;
      Cookies.set('authTokendr2', access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      dispatch(addUser(user));
      Cookies.set('message', message || 'Driver created successfully!', {
        expires: 7,
      });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
      Cookies.set('status', 'Driver created!', { expires: 7 });

      navigate('/dashboard');
    } catch (err) {
      console.error('An error occurred during verification:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-component">
      <Box className="verification-container">
        <SecurityIcon className="security-icon" />
        <header className="verification-header">{`Let’s verify your account, ${name}!`}</header>
        {error && <Typography className="error-text">{error}</Typography>}
        <form onSubmit={verifyAccount}>
          {/* Text Input for Car Type */}
          <div className="input-group">
            <div className="car-type">
              <label htmlFor="carType" className="car-type-label">
                Car Type
              </label>
              <div className="car-type-select">
                <select
                  id="carType"
                  ref={inputRefs.carType}
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
                  <option value="Van">Van</option>
                  <option value="TukTuk">Tuk Tuk - Pick-Up</option>
                </select>
              </div>
            </div>
          </div>

          {/* Driver Documents */}
          <Typography
            variant="h6"
            className="section-header"
            fontFamily={'Montserrat'}
            color="#ffa600"
          >
            Driver Documents
          </Typography>
          <div className="input-group">
            <label>ID Number</label>
            <input
              type="text"
              placeholder="Enter your ID Number"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="input-group">
            <label>Driving License</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDrivingLicenseFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>National ID (Front)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNationalIDFrontFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>National ID (Back)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNationalIDBackFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>PSV Badge Driving License</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPsvBadgeFile(e.target.files[0])}
              required
            />
          </div>

          {/* Vehicle Documents */}
          <Typography
            variant="h6"
            className="section-header"
            fontFamily={'Montserrat'}
            color="#ffa600"
          >
            Vehicle Documents
          </Typography>
          <div className="input-group">
            <input
              ref={inputRefs.licensePlate}
              placeholder="Car Number Plate"
              className="login-input"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
            />
            <label>Vehicle Registration (Logbook)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehicleRegistrationFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>Vehicle Picture (front)</label>
            <span className="small-text">Plate number should be visible</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehiclePictureFrontFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>Vehicle Picture (back)</label>
            <span className="small-text">Plate number should be visible</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehiclePictureBackFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>PSV Car Insurance</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPsvCarInsuranceFile(e.target.files[0])}
              required
            />
          </div>
          <div className="input-group">
            <label>Inspection Report</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setInspectionReportFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="verify-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            className="verify-button"
            onClick={() => navigate('/signup')}
          >
            Go back
          </button>
        </form>
      </Box>
    </div>
  );
};

export default Verification;
