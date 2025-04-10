// import React from 'react';

// const ProgressBar = () => {
//   // Inline styles
//   const containerStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     width: '600px',
//     margin: '50px auto',
//     fontFamily: 'Arial, sans-serif',
//   };

//   const stepContainerStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   };

//   const activeCircleStyle = {
//     width: '28px',
//     height: '28px',
//     backgroundColor: '#28a745', // green color for active step
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   };

//   const innerDotStyle = {
//     width: '10px',
//     height: '10px',
//     borderRadius: '50%',
//     backgroundColor: '#fff',
//   };

//   const inactiveCircleStyle = {
//     width: '28px',
//     height: '28px',
//     backgroundColor: '#fff',
//     border: '2px solid #ccc',
//     borderRadius: '50%',
//   };

//   const stepTitleActiveStyle = {
//     marginTop: '8px',
//     fontSize: '14px',
//     color: '#000',
//   };

//   const stepTitleInactiveStyle = {
//     marginTop: '8px',
//     fontSize: '14px',
//     color: '#999',
//   };

//   const lineStyle = {
//     flex: 1,
//     height: '2px',
//     backgroundColor: '#ccc',
//     margin: '0 16px',
//   };

//   return (
//     <div style={containerStyle}>
//       {/* STEP 1: Verify Driver Requirements (Active) */}
//       <div style={stepContainerStyle}>
//         <div style={activeCircleStyle}>
//           {/* Optional inner dot */}
//           <div style={innerDotStyle} />
//         </div>
//         <span style={stepTitleActiveStyle}>Verify Driver Requirements</span>
//       </div>

//       {/* Connector Line */}
//       <div style={lineStyle} />

//       {/* STEP 2: Add Vehicle (Inactive) */}
//       <div style={stepContainerStyle}>
//         <div style={inactiveCircleStyle} />
//         <span style={stepTitleInactiveStyle}>Add Vehicle</span>
//       </div>

//       {/* Connector Line */}
//       <div style={lineStyle} />

//       {/* STEP 3: Complete (Inactive) */}
//       <div style={stepContainerStyle}>
//         <div style={inactiveCircleStyle} />
//         <span style={stepTitleInactiveStyle}>Complete</span>
//       </div>
//     </div>
//   );
// };

// export default ProgressBar;
