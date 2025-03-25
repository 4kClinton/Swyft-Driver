// import { useState, useEffect, createRef, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Typography, Box, Snackbar, Alert } from '@mui/material';
// import SecurityIcon from '@mui/icons-material/Security';
// import '../Styles/Verification.css';
// import { addUser } from '../Redux/Reducers/UserSlice';
// import { useDispatch } from 'react-redux';
// import { v4 as uuidv4 } from 'uuid';
// import Cookies from 'js-cookie';
// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;

// const Verification = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Retrieve signup data from cookies
//   const storedData = Cookies.get('signupData');
//   const parsedData = storedData ? JSON.parse(storedData) : {};
//   const { first_name, last_name, phoneNumber, email, password, licenseNumber } =
//     parsedData;

//   // Unique driver ID
//   const [id] = useState(() => uuidv4());
//   const [carType, setCarType] = useState('');
//   const [licensePlate, setLicensePlate] = useState('');
//   const [idNumber, setIdNumber] = useState('');

//   const [loading, setLoading] = useState(false);

//   // Snackbar state for errors and success
//   const [error, setError] = useState(null);
//   const [openError, setOpenError] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [openSuccess, setOpenSuccess] = useState(false);

//   // File states for Driver Documents
//   const [drivingLicenseFile, setDrivingLicenseFile] = useState(null);
//   const [nationalIDFrontFile, setNationalIDFrontFile] = useState(null);
//   const [nationalIDBackFile, setNationalIDBackFile] = useState(null);
//   const [psvBadgeFile, setPsvBadgeFile] = useState(null);

//   // File states for Vehicle Documents
//   const [vehicleRegistrationFile, setVehicleRegistrationFile] = useState(null);
//   const [vehiclePictureFrontFile, setVehiclePictureFrontFile] = useState(null);
//   const [vehiclePictureBackFile, setVehiclePictureBackFile] = useState(null);
//   const [psvCarInsuranceFile, setPsvCarInsuranceFile] = useState(null);
//   const [inspectionReportFile, setInspectionReportFile] = useState(null);

//   // Create refs for text inputs
//   const inputRefs = useMemo(
//     () => ({
//       carType: createRef(),
//       licenseNumber: createRef(),
//       licensePlate: createRef(),
//     }),
//     []
//   );

//   useEffect(() => {
//     const handleFocus = (e) => {
//       e.target.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//     };

//     Object.values(inputRefs).forEach((inputRef) => {
//       if (inputRef.current) {
//         inputRef.current.addEventListener('focus', handleFocus);
//       }
//     });

//     return () => {
//       Object.values(inputRefs).forEach((inputRef) => {
//         if (inputRef.current) {
//           inputRef.current.removeEventListener('focus', handleFocus);
//         }
//       });
//     };
//   }, [inputRefs]);

//   useEffect(() => {
//     if (!first_name) {
//       navigate('/signup');
//     }
//   }, [first_name, navigate]);

//   // Helper to upload a file and return its public URL
//   const uploadFile = async (file, fileName, userId) => {
//     console.log(STORAGE_BUCKET);

//     if (!file) return null;

//     const filePath = `${userId}/${fileName}`;

//     console.log(`Uploading ${fileName} to ${filePath}...`);

//     const { error: uploadError } = await supabase.storage
//       .from(STORAGE_BUCKET)
//       .upload(filePath, file);

//     if (uploadError) {
//       console.error(`Upload failed for ${fileName}:, uploadError`);
//       throw new Error(`Upload failed for ${fileName}: ${uploadError.message}`);
//     }

//     // ✅ Correctly retrieve public URL
//     const { data } = supabase.storage
//       .from(STORAGE_BUCKET)
//       .getPublicUrl(filePath);

//     if (!data || !data.publicUrl) {
//       console.error(`Failed to retrieve public URL for ${fileName}`);
//       return null;
//     }

//     console.log(`Public URL for ${fileName}:, data.publicUrl`);
//     return data.publicUrl;
//   };

//   const verifyAccount = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);
//     console.log(STORAGE_BUCKET);
//     console.log(SUPABASE_URL, SUPABASE_KEY);

//     const sanitizedEmail = email.trim().toLowerCase();

//     try {
//       //Phase 1: Preliminary Verification (Text Data Only)
//       // const preliminaryResponse = await fetch(
//       //   'https://swyft-backend-client-nine.vercel.app/driver/signup',
//       //   {
//       //     method: 'POST',
//       //     headers: { 'Content-Type': 'application/json' },
//       //     body: JSON.stringify({
//       //       id,
//       //       first_name,
//       //       last_name,
//       //       phone: phoneNumber,
//       //       email: sanitizedEmail,
//       //       carType,
//       //       password,
//       //       licenseNumber,
//       //       licensePlate,
//       //       idNumber,
//       //     }),
//       //   }
//       // );

//       // const preliminaryData = await preliminaryResponse.json();
//       // console.log('Preliminary Response:', preliminaryData);

//       // if (!preliminaryResponse.ok) {
//       //   throw new Error(
//       //     `Verification failed: ${preliminaryData.error || 'Please try again.'}`
//       //   );
//       // }

//       // const driverId = preliminaryData.id || id;
//       // console.log('Driver ID after preliminary verification:', driverId);

//       // Phase 2: Upload Files Only if Preliminary Check Passed
//       const drivingLicenseURL = await uploadFile(
//         drivingLicenseFile,
//         'drivingLicense.jpg',
//         driverId
//       );
//       const nationalIDFrontURL = await uploadFile(
//         nationalIDFrontFile,
//         'nationalID_front.jpg',
//         driverId
//       );
//       const nationalIDBackURL = await uploadFile(
//         nationalIDBackFile,
//         'nationalID_back.jpg',
//         driverId
//       );
//       const psvBadgeURL = await uploadFile(psvBadgeFile, 'psvBadge.jpg', id);

//       const vehicleRegistrationURL = await uploadFile(
//         vehicleRegistrationFile,
//         'vehicleRegistration.jpg',
//         driverId
//       );
//       const vehiclePictureFrontURL = await uploadFile(
//         vehiclePictureFrontFile,
//         'vehiclePicture_front.jpg',
//         driverId
//       );
//       const vehiclePictureBackURL = await uploadFile(
//         vehiclePictureBackFile,
//         'vehiclePicture_back.jpg',
//         driverId
//       );
//       const psvCarInsuranceURL = await uploadFile(
//         psvCarInsuranceFile,
//         'psvCarInsurance.jpg',
//         driverId
//       );
//       const inspectionReportURL = await uploadFile(
//         inspectionReportFile,
//         'inspectionReport.jpg',
//         driverId
//       );

//       // Phase 3: Update User Record with Document URLs
//       const updateResponse = await fetch(
//         'https://swyft-backend-client-nine.vercel.app/driver/signup/update-documents',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             id,
//             documents: {
//               drivingLicense: drivingLicenseURL,
//               nationalIDFront: nationalIDFrontURL,
//               nationalIDBack: nationalIDBackURL,
//               psvBadge: psvBadgeURL,
//               vehicleRegistration: vehicleRegistrationURL,
//               vehiclePictureFront: vehiclePictureFrontURL,
//               vehiclePictureBack: vehiclePictureBackURL,
//               psvCarInsurance: psvCarInsuranceURL,
//               inspectionReport: inspectionReportURL,
//             },
//           }),
//         }
//       );

//       const updateData = await updateResponse.json();

//       if (!updateResponse.ok) {
//         throw new Error(
//           `Document update failed: ${updateData.error || 'Please try again.'}`
//         );
//       }

//       // Save authentication tokens and user info
//       Cookies.set('authTokendr2', updateData.access_token, {
//         expires: 7,
//         secure: true,
//         sameSite: 'Strict',
//       });
//       dispatch(addUser(updateData.user));
//       Cookies.set(
//         'message',
//         updateData.message || 'Driver created successfully!',
//         { expires: 7 }
//       );
//       Cookies.set('user', JSON.stringify(updateData.user), { expires: 7 });
//       Cookies.set('status', 'Driver created!', { expires: 7 });

//       // Set success message and open success popup
//       setSuccessMessage(updateData.message || 'Account verified successfully!');
//       setOpenSuccess(true);
//     } catch (err) {
//       console.error('An error occurred during verification:', err);
//       setError('An error occurred. Please try again.');
//       setOpenError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseError = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setOpenError(false);
//   };

//   const handleCloseSuccess = (event, reason) => {
//     if (reason === 'clickaway') return;
//     setOpenSuccess(false);
//     navigate('/unverified');
//   };

//   return (
//     <div className="verification-component">
//       <Box className="verification-container">
//         <SecurityIcon className="security-icon" />
//         <header className="verification-header">
//           {`Let’s verify your account, ${first_name} ${last_name}!`}
//         </header>
//         <form onSubmit={verifyAccount}>
//           {/* Car Type and other text inputs */}
//           <div className="input-group">
//             <div className="car-type">
//               <label htmlFor="carType" className="car-type-label">
//                 Car Type
//               </label>
//               <div className="car-type-select">
//                 <select
//                   id="carType"
//                   ref={inputRefs.carType}
//                   value={carType}
//                   onChange={(e) => setCarType(e.target.value)}
//                   required
//                   className="car-type-dropdown"
//                 >
//                   <option value="" disabled>
//                     Select Car Type
//                   </option>
//                   <option value="pickup">Swyft Pickup</option>
//                   <option value="miniTruck">Swyft Mini Truck</option>
//                   <option value="lorry">Swyft Lorry</option>
//                   <option value="Van">Swyft Van</option>
//                   <option value="TukTuk">Swyft Tuk Tuk - Swyft Pick-Up</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Driver Documents */}
//           <Typography
//             variant="h6"
//             className="section-header"
//             fontFamily={'Montserrat'}
//             color="#ffa600"
//           >
//             Driver Documents
//           </Typography>
//           <div className="input-group">
//             <label>ID Number</label>
//             <input
//               type="text"
//               placeholder="Enter your ID Number"
//               value={idNumber}
//               onChange={(e) => setIdNumber(e.target.value)}
//               required
//               className="login-input"
//             />
//           </div>
//           <div className="input-group">
//             <label>Driving License</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setDrivingLicenseFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>National ID (Front)</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNationalIDFrontFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>National ID (Back)</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNationalIDBackFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>PSV Badge Driving License</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setPsvBadgeFile(e.target.files[0])}
//               required
//             />
//           </div>

//           {/* Vehicle Documents */}
//           <Typography
//             variant="h6"
//             className="section-header"
//             fontFamily={'Montserrat'}
//             color="#ffa600"
//           >
//             Vehicle Documents
//           </Typography>
//           <div className="input-group">
//             <input
//               ref={inputRefs.licensePlate}
//               placeholder="Car Number Plate"
//               className="login-input"
//               value={licensePlate}
//               onChange={(e) => setLicensePlate(e.target.value)}
//               required
//             />
//             <label>Vehicle Registration (Logbook)</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setVehicleRegistrationFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Vehicle Picture (front)</label>
//             <span className="small-text">Plate number should be visible</span>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setVehiclePictureFrontFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Vehicle Picture (back)</label>
//             <span className="small-text">Plate number should be visible</span>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setVehiclePictureBackFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>PSV Car Insurance</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setPsvCarInsuranceFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <div className="input-group">
//             <label>Inspection Report</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setInspectionReportFile(e.target.files[0])}
//               required
//             />
//           </div>
//           <button type="submit" className="verify-button" disabled={loading}>
//             {loading ? 'Verifying...' : 'Verify'}
//           </button>
//           <button
//             type="button"
//             className="verify-button"
//             onClick={() => navigate('/signup')}
//           >
//             Go back
//           </button>
//         </form>
//       </Box>

//       {/* Error Popup */}
//       <Snackbar
//         open={openError}
//         autoHideDuration={6000}
//         onClose={handleCloseError}
//       >
//         <Alert
//           onClose={handleCloseError}
//           severity="error"
//           sx={{ width: '100%' }}
//         >
//           {error}
//         </Alert>
//       </Snackbar>

//       {/* Success Popup */}
//       <Snackbar
//         open={openSuccess}
//         autoHideDuration={3000}
//         onClose={handleCloseSuccess}
//       >
//         <Alert
//           onClose={handleCloseSuccess}
//           severity="success"
//           sx={{ width: '100%' }}
//         >
//           {successMessage}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default Verification;

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

const Verification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Retrieve signup data from cookies
  const storedData = JSON.parse(Cookies.get('signupData')) || {};
  const { first_name, last_name, phoneNumber, email, password, licenseNumber } =
    storedData;

  // Unique driver ID
  const [id] = useState(() => uuidv4());
  const [carType, setCarType] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const [loading, setLoading] = useState(false);

  // Snackbar state for errors and success
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);

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

  // Create refs for text inputs
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
    if (!first_name) {
      navigate('/signup');
    }
  }, [first_name, navigate]);

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
            licenseNumber,
            licensePlate,
            idNumber,
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
      const psvBadgeURL = await uploadFile(psvBadgeFile, 'psvBadge.jpg');

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

      const updateData = await updateResponse.json();

      if (!updateResponse.ok) {
        throw new Error(
          `Document update failed: ${updateData.error || 'Please try again.'}`
        );
      }

      // Save authentication tokens and user info
      Cookies.set('authTokendr2', updateData.access_token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      dispatch(addUser(updateData.user));
      Cookies.set(
        'message',
        updateData.message || 'Driver created successfully!',
        { expires: 7 }
      );
      Cookies.set('user', JSON.stringify(updateData.user), { expires: 7 });
      Cookies.set('status', 'Driver created!', { expires: 7 });

      // Set success message and open success popup
      setSuccessMessage(updateData.message || 'Account verified successfully!');
      setOpenSuccess(true);
    } catch (err) {
      console.error('An error occurred during verification:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setOpenError(true);
    } finally {
      setLoading(false);
    }
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
        <form onSubmit={verifyAccount}>
          {/* Car Type and other text inputs */}
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

      {/* Error Popup */}
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

      {/* Success Popup */}
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
