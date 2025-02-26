import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

//eslint-disable-next-line
const BottomNav = ({ value, onChange }) => {
  const location = useLocation(); // Get the current path

  return (
    <BottomNavigation
      className="BottomNavigation"
      value={location.pathname} // Use the current path as the value
      onChange={(event, newValue) => {
        onChange(newValue); // Optional: Lift state up to parent if needed
      }}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        zIndex: 6000,
        backgroundColor: '#212121',
        color: '#fff',
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon sx={{ color: '#ffa600' }} />}
        component={Link}
        to="/dashboard"
        value="/dashboard"
        sx={{
          '& .MuiBottomNavigationAction-label': {
            color: '#fff',
          },
        }}
      />
      <BottomNavigationAction
        label="Rides"
        icon={<DriveEtaIcon sx={{ color: '#ffa600' }} />}
        component={Link}
        to="/rides"
        value="/rides"
        sx={{
          '& .MuiBottomNavigationAction-label': {
            color: '#fff',
          },
        }}
      />
      <BottomNavigationAction
        label="Notifications"
        icon={<NotificationsIcon sx={{ color: '#ffa600' }} />}
        component={Link}
        to="/notifications"
        value="/notifications"
        sx={{
          '& .MuiBottomNavigationAction-label': {
            color: '#fff',
          },
        }}
      />
      <BottomNavigationAction
        label="Profile"
        icon={<PersonIcon sx={{ color: '#ffa600' }} />}
        component={Link}
        to="/profile"
        value="/profile"
        sx={{
          '& .MuiBottomNavigationAction-label': {
            color: '#fff',
          },
        }}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
