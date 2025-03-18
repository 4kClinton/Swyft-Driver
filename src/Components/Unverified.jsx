import unverified from '../assets/unverified.png';
import '../Styles/Unverified.css';

const Unverified = () => {
  return (
    <div className="unverified-container">
      <img
        src={unverified}
        alt="Verification Pending"
        className="unverified-image"
      />
      <h1 className="unverified-title">Please wait...</h1>
      <p className="unverified-text">
        Your account is under verification. We will notify you once it is
        approved.
      </p>
    </div>
  );
};

export default Unverified;
