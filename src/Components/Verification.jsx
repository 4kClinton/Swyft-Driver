import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect, createRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import '../Styles/Verification.css';
import { addUser } from '../Redux/Reducers/UserSlice';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;

// Progress Bar Component using inline styles
const ProgressBar = ({ activeStep }) => {
  const activeCircleStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const inactiveCircleStyle = {
    width: '28px',
    height: '28px',
    backgroundColor: '#fff',
    border: '2px solid #ccc',
    borderRadius: '50%',
  };

  const stepContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const stepTitleActiveStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: 'rgb(40, 167, 69)',
  };

  const stepTitleInactiveStyle = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#999',
  };

  const lineStyle = {
    flex: 1,
    height: '2px',
    backgroundColor: '#ccc',
    margin: '0 16px',
  };

  const steps = ['Verify Driver Requirements', 'Add Vehicle', 'Complete'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '30px',
        fontFamily: 'Montserrat',
      }}
    >
      {steps.map((title, index) => {
        const isActive = index === activeStep - 1;
        return (
          <React.Fragment key={index}>
            <div style={stepContainerStyle}>
              <div style={isActive ? activeCircleStyle : inactiveCircleStyle}>
                {isActive && (
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                    }}
                  />
                )}
              </div>
              <span
                style={isActive ? stepTitleActiveStyle : stepTitleInactiveStyle}
              >
                {title}
              </span>
            </div>
            {index !== steps.length - 1 && <div style={lineStyle} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

ProgressBar.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve signup data from cookies
  const storedData = JSON.parse(Cookies.get('signupData')) || {};
  const { first_name, last_name, phoneNumber, email, password } = storedData;

  // Unique driver ID
  const [id] = useState(() => uuidv4());

  // Step state (1: Driver, 2: Vehicle, 3: Complete)
  const [step, setStep] = useState(1);

  // Driver info state
  const [drivingLicenseFile, setDrivingLicenseFile] = useState(null);
  const [nationalIDFrontFile, setNationalIDFrontFile] = useState(null);
  const [nationalIDBackFile, setNationalIDBackFile] = useState(null);

  // New fields for Driver Requirements:
  const [kraFile, setKraFile] = useState(null);
  const [passportPhotoFile, setPassportPhotoFile] = useState(null);
  const [certificateOfGoodConductFile, setCertificateOfGoodConductFile] =
    useState(null);

  // Vehicle info state
  const [carType, setCarType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehiclePictureFrontFile, setVehiclePictureFrontFile] = useState(null);
  const [vehiclePictureBackFile, setVehiclePictureBackFile] = useState(null);
  const [CarInsuranceFile, setCarInsuranceFile] = useState(null);

  // New state for Vehicle Details
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');

  // New field for Vehicle Requirements:
  const [
    companyRegistrationCertificateFile,
    setCompanyRegistrationCertificateFile,
  ] = useState(null);

  // Make Inspection Report optional:
  const [inspectionReportFile, setInspectionReportFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // Snackbar state for errors and success
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);

  // Create refs for text inputs
  const inputRefs = useMemo(
    () => ({
      carType: createRef(),
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
    if (!first_name) {
      navigate('/signup');
    }
    // eslint-disable-next-line
  }, [first_name]);

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
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    if (!data || !data.publicUrl) {
      console.error(`Failed to retrieve public URL for ${fileName}`);
      return null;
    }
    return data.publicUrl;
  };

  // Final submission handler, triggered in step 3
  const verifyAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const sanitizedEmail = email.trim().toLowerCase();

    try {
      // Phase 1: Preliminary Verification (Text Data Only)
      const preliminaryResponse = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/signup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            first_name,
            last_name,
            phone: phoneNumber,
            email: sanitizedEmail,
            carType,
            password,
            licensePlate,
            // Optionally include the new vehicle details in your API call:
            vehicleMake,
            vehicleModel,
            vehicleYear,
            vehicleColor,
          }),
        }
      );
      const preliminaryData = await preliminaryResponse.json();

      if (!preliminaryResponse.ok) {
        throw new Error(
          `Verification failed: ${preliminaryData.error || 'Please try again.'}`
        );
      }

      // Phase 2: Upload Files Only if Preliminary Check Passed
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

      // New driver documents
      const kraURL = await uploadFile(kraFile, 'kra.jpg');
      const passportPhotoURL = await uploadFile(
        passportPhotoFile,
        'passportPhoto.jpg'
      );
      const certificateOfGoodConductURL = await uploadFile(
        certificateOfGoodConductFile,
        'certificateOfGoodConduct.jpg'
      );

      const vehiclePictureFrontURL = await uploadFile(
        vehiclePictureFrontFile,
        'vehiclePicture_front.jpg'
      );
      const vehiclePictureBackURL = await uploadFile(
        vehiclePictureBackFile,
        'vehiclePicture_back.jpg'
      );
      const CarInsuranceURL = await uploadFile(
        CarInsuranceFile,
        'CarInsurance.jpg'
      );

      // New vehicle document field (optional file, so may be null)
      const companyRegistrationCertificateURL = await uploadFile(
        companyRegistrationCertificateFile,
        'companyRegistrationCertificate.jpg'
      );

      // Inspection report is optional
      const inspectionReportURL = await uploadFile(
        inspectionReportFile,
        'inspectionReport.jpg'
      );

      // Phase 3: Update User Record with Document URLs
      const updateResponse = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/signup/update-documents',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            documents: {
              drivingLicense: drivingLicenseURL,
              nationalIDFront: nationalIDFrontURL,
              nationalIDBack: nationalIDBackURL,
              kra: kraURL,
              passportPhoto: passportPhotoURL,
              certificateOfGoodConduct: certificateOfGoodConductURL,
              vehiclePictureFront: vehiclePictureFrontURL,
              vehiclePictureBack: vehiclePictureBackURL,
              CarInsurance: CarInsuranceURL,
              companyRegistrationCertificate: companyRegistrationCertificateURL,
              inspectionReport: inspectionReportURL, // may be null if not provided
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Document update failed: Please try again.`);
      }

      // Save authentication tokens and user info
      Cookies.set('authTokendr2', preliminaryData.access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      dispatch(addUser(preliminaryData.user));
      Cookies.set(
        'message',
        preliminaryData.message || 'Driver created successfully!',
        { expires: 7 }
      );
      Cookies.set('user', JSON.stringify(preliminaryData.user), { expires: 7 });
      Cookies.set('status', 'Driver created!', { expires: 7 });

      setSuccessMessage(
        preliminaryData.message || 'Account verified successfully!'
      );
      setOpenSuccess(true);
    } catch (err) {
      console.error('An error occurred during verification:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setOpenError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenError(false);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSuccess(false);
    navigate('/unverified');
  };

  return (
    <div className="verification-component">
      <Box className="verification-container">
        <SecurityIcon className="security-icon" />
        <header className="verification-header">
          {`Let’s verify your account, ${first_name} ${last_name}!`}
        </header>

        {/* Render the progress bar with active step */}
        <ProgressBar activeStep={step} />

        <form
          onSubmit={
            step === 3
              ? verifyAccount
              : (e) => {
                  e.preventDefault();
                  handleNext();
                }
          }
        >
          {step === 1 && (
            <>
              <Typography
                variant="h6"
                className="section-header"
                fontFamily={'Montserrat'}
                color="#ffa600"
                fontWeight="bold"
              >
                Driver Requirements
              </Typography>

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

              {/* New Driver Requirement Fields */}
              <div className="input-group">
                <label>KRA</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setKraFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="input-group">
                <label>Passport Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPassportPhotoFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="input-group">
                <label>Certificate of Good Conduct</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCertificateOfGoodConductFile(e.target.files[0])
                  }
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Typography
                variant="h6"
                className="section-header"
                fontFamily={'Montserrat'}
                color="#ffa600"
                fontWeight="bold"
              >
                Vehicle Requirements
              </Typography>
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
                      <option value="pickup">Swyft Pickup</option>
                      <option value="miniTruck">Swyft MiniTruck</option>
                      <option value="lorry5Tonne">Swyft Lorry 5 Tonne</option>
                      <option value="lorry10Tonne">Swyft Lorry 10 Tonne</option>
                      <option value="van">Swyft Van</option>
                      <option value="carRescue">Swyft Car Rescue</option>
                      <option value="SwyftBoda">Swyft Boda</option>
                      <option value="SwyftBodaElectric">
                        Swyft Boda Electric
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <input
                  ref={inputRefs.licensePlate}
                  placeholder="Car Number Plate"
                  className="login-input"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                />
              </div>
              {/* New Vehicle Detail Fields */}
              <div className="input-group">
                <label>Vehicle Make</label>
                <select
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Vehicle Make
                  </option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                </select>
              </div>
              <div className="input-group">
                <label>Vehicle Model</label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Vehicle Model
                  </option>
                  <option value="Corolla">Hilux</option>
                  <option value="Civic">Civic</option>
                  <option value="Focus">Focus</option>
                  <option value="Malibu">Malibu</option>
                </select>
              </div>
              <div className="input-group">
                <label>Vehicle Year</label>
                <select
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {Array.from({ length: 26 }, (_, i) => 2000 + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="input-group">
                <label>Vehicle Color</label>
                <input
                  type="text"
                  placeholder="Enter color"
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>Vehicle Picture (front)</label>
                <span className="small-text">
                  Plate number should be visible
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setVehiclePictureFrontFile(e.target.files[0])
                  }
                  required
                />
              </div>
              <div className="input-group">
                <label>Vehicle Picture (back)</label>
                <span className="small-text">
                  Plate number should be visible
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVehiclePictureBackFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="input-group">
                <label>Car Insurance</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCarInsuranceFile(e.target.files[0])}
                  required
                />
              </div>
              {/* New Vehicle Requirement Field */}
              <div className="input-group">
                <label>Company Registration Certificate (if applicable)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setCompanyRegistrationCertificateFile(e.target.files[0])
                  }
                />
              </div>
              <div className="input-group">
                <label>Inspection Report (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setInspectionReportFile(e.target.files[0])}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Typography
                variant="h6"
                className="section-header"
                fontFamily={'Montserrat'}
                color="#ffa600"
                fontWeight="bold"
              >
                Complete Verification
              </Typography>
              <Typography variant="body1" style={{ marginBottom: '20px' }}>
                Confirm your details and click &quot;Verify&quot; to submit your
                information.
              </Typography>
            </>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            {step > 1 && (
              <button
                type="button"
                className="verify-button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button type="submit" className="verify-button">
                Next
              </button>
            )}
            {step === 3 && (
              <button
                type="submit"
                className="verify-button"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            )}
          </div>
        </form>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={openSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Verification;
