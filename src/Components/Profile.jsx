import { useEffect, useState } from 'react';

import styles from '../Styles/Profile.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../Redux/Reducers/UserSlice';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useSelector((state) => state.user.value);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({
    name: user.name || '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || '',
  });

  useEffect(() => {
    if (user.id) {
      setProfile(user);
    }
  }, [user]);
  console.log(profile);

  const handleSave = async () => {
    console.log(profile);

    const token = sessionStorage.getItem('authToken');
    setIsEditing(false);
    try {
      const response = await fetch(
        'https://swyft-backend-client-nine.vercel.app/driver/profile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      dispatch(addUser(updatedProfile));
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles['profile-container']}>
      {error && <div className={styles['error-message']}>{error}</div>}
      <div
        className={`${styles['profile-card']} ${isEditing ? styles.editing : ''}`}
      >
        <div
          className={styles['profile-header']}
          style={{
            background: isEditing
              ? '#1e1f21' // darker shade for editing mode
              : 'linear-gradient(to right, #006a3d, #004d2a)', // darker gradient shades
          }}
        >
          <div className={styles['profile-header-content']}>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`${styles.button} ${styles['button-cancel']}`}
                  style={{ backgroundColor: 'gray', color: 'black' }}
                >
                  Cancel
                </button>
                <div>Edit Profile</div>
                <button
                  onClick={handleSave}
                  className={`${styles.button} ${styles['button-save']}`}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                style={{ backgroundColor: 'black' }}
                onClick={() => setIsEditing(true)}
                className={`${styles.button} ${styles['button-edit']}`}
              >
                Edit
              </button>
            )}
          </div>

          <div className={styles['profile-avatar-container']}>
            <div className={styles['profile-avatar']}>
              <img
                src={
                  profile.avatar ||
                  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
                }
                alt="Profile picture"
                width={96}
                height={96}
              />
            </div>
            {isEditing && (
              <button className={styles['edit-avatar-button']}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Name to be removed */}
        <div className={styles['profile-form']}>
          {!profile.first_name && (
            <div className={styles['form-group']}>
              <label htmlFor="name" className={styles['form-label']}>
                NAME
              </label>
              <input
                id="name"
                value={profile.name}
                placeholder="John Doe"
                readOnly={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className={styles['form-input']}
              />
            </div>
          )}

          <div className={styles['form-group']}>
            <label htmlFor="first_name" className={styles['form-label']}>
              FIRST NAME
            </label>
            <input
              id="first_name"
              value={profile.first_name}
              placeholder="John"
              readOnly={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, first_name: e.target.value })
              }
              className={styles['form-input']}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="last_name" className={styles['form-label']}>
              LAST NAME
            </label>
            <input
              id="last_name"
              value={profile.last_name}
              placeholder="Doe"
              readOnly={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, last_name: e.target.value })
              }
              className={styles['form-input']}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="email" className={styles['form-label']}>
              YOUR EMAIL
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              placeholder="johndoe@gmail.com"
              readOnly={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className={styles['form-input']}
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="phone" className={styles['form-label']}>
              YOUR PHONE
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              placeholder="0722319283"
              readOnly={!isEditing}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className={styles['form-input']}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
