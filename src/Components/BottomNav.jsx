import PropTypes from 'prop-types';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import DriveEtaIcon from '@mui/icons-material/DriveEta';

const BottomNav = ({ onChange }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (route) => (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    if (onChange) onChange(route);
    navigate(route);
  };

  return (
    <BottomNavigation
      className="BottomNavigation"
      value={location.pathname}
      onChange={(event, newValue) => {
        // Keeping this handler intact—if needed for lifting state up.
        if (onChange) onChange(newValue);
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
        onClick={handleNavigation('/dashboard')}
        component={Link}
        to="/dashboard"
        value="/dashboard"
        sx={{
          '& .MuiBottomNavigationAction-label': { color: '#fff' },
        }}
      />
      <BottomNavigationAction
        label="Rides"
        icon={<DriveEtaIcon sx={{ color: '#ffa600' }} />}
        onClick={handleNavigation('/rides')}
        component={Link}
        to="/rides"
        value="/rides"
        sx={{
          '& .MuiBottomNavigationAction-label': { color: '#fff' },
        }}
      />
      <BottomNavigationAction
        label="Notifications"
        icon={<NotificationsIcon sx={{ color: '#ffa600' }} />}
        onClick={handleNavigation('/notifications')}
        component={Link}
        to="/notifications"
        value="/notifications"
        sx={{
          '& .MuiBottomNavigationAction-label': { color: '#fff' },
        }}
      />
      <BottomNavigationAction
        label="Profile"
        icon={<PersonIcon sx={{ color: '#ffa600' }} />}
        onClick={handleNavigation('/profile')}
        component={Link}
        to="/profile"
        value="/profile"
        sx={{
          '& .MuiBottomNavigationAction-label': { color: '#fff' },
        }}
      />
    </BottomNavigation>
  );
};

BottomNav.propTypes = {
  onChange: PropTypes.func,
};

export default BottomNav;
