import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useUser } from './UserContext';
import { updatePassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';

export const Settings: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const auth = useAuth();
  const { userData, setUserData } = useUser(); // @ts-ignore
  const [newPassword, setNewPassword] = useState('');

  const toggleSettings = () => {
    setIsSettingsOpen(prevState => !prevState);
  };

  const handleUpdateUsername = async () => {
    if (!auth.user?.email) {
      alert("No user is logged in.");
      return;
    }

    if (!newUsername) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      // API call to update username in MongoDB
      const response = await fetch('http://localhost:5000/api/user/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth.user.email, newUsername }),
      });

      if (response.ok) {
        setUserData(prev => prev ? { ...prev, username: newUsername } : prev); 
        alert('Username updated successfully!');
        setNewUsername('')
      } else {
        const errorData = await response.json();
        console.error('Error updating username:', errorData);
        alert('Unable to update username.');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Unable to update username.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      // Delete user from Firebase authentication
      const currentUser = auth.user;

      if (currentUser) {
        await currentUser.delete(); // Delete the user from Firebase Authentication
        console.log("Firebase user deleted");

        // Delete user from MongoDB through the API
        const response = await fetch(`http://localhost:5000/api/user/${currentUser.email}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Account deleted successfully!');
        } else {
          const errorData = await response.json();
          console.error('Error deleting user in MongoDB:', errorData);
          alert('Unable to delete account in MongoDB.');
        }
      } else {
        alert('No user is currently logged in.');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Unable to delete account.');
    }
  };

  const handleUpdatePassword = async () => {
    const currentUser = auth.user;
  
    if (!currentUser) {
      alert("No user is logged in.");
      return;
    }
  
    if (!newPassword) {
      alert("Password cannot be empty.");
      return;
    }
  
    try {
      await updatePassword(currentUser, newPassword);
      alert('Password updated successfully!');
      setNewPassword(''); // Clear the password field
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        alert("Please re-login and try again.");
      } else {
        console.error('Error updating password:', error);
        alert('Unable to update password.');
      }
    }
  };

  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePic(event.target.files[0]);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePic) {
      alert('No profile picture selected.');
      return;
    }

    if (!auth.user) {
      alert('No user is logged in.');
      return;
    }

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${auth.user.uid}/${profilePic.name}`);
      const snapshot = await uploadBytes(storageRef, profilePic);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save the download URL to MongoDB via an API call
      const response = await fetch(`http://localhost:5000/api/user/profilePic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: auth.user.email, profilePic: downloadURL }),
      });

      if (response.ok) {
        setUserData(prev => prev ? { ...prev, profilePic: downloadURL } : prev);
        setUrl(downloadURL);
        alert('Profile picture updated successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error saving profile picture URL:', errorData);
        alert('Unable to save profile picture.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Unable to upload image.');
    }
  };

  return (
    <div style={{ width: '100%', border: '4px solid white', height: '80px', marginTop: '-3px', position: 'relative', backgroundColor: '#323232' }}>
      <button style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Settings" onClick={toggleSettings}>
        <svg xmlns="http://www.w3.org/2000/svg" width="52" height="53" viewBox="0 0 52 53" fill="none">
          <path d="M20.0152 52.25L18.8375 43.9471C17.9644 43.651 17.0369 43.225 16.0552 42.669C15.073 42.113 14.2182 41.5225 13.4908 40.8973L5.77844 44.3245L0 34.1811L6.87019 29.0813C6.78769 28.6229 6.72856 28.1346 6.69281 27.6162C6.65706 27.0978 6.63919 26.6095 6.63919 26.1511C6.63919 25.7107 6.65706 25.2329 6.69281 24.7177C6.72856 24.2021 6.78769 23.6858 6.87019 23.1688L0 18.051L5.77844 7.97844L13.4647 11.3616C14.2448 10.7305 15.1106 10.1413 16.0621 9.59406C17.0136 9.04727 17.93 8.63225 18.8114 8.349L20.0152 0H31.5157L32.6934 8.32906C33.643 8.67831 34.5664 9.1041 35.4633 9.60644C36.3607 10.1088 37.1931 10.6938 37.9603 11.3616L45.7696 7.97844L51.5309 18.051L44.5555 23.1743C44.6728 23.6867 44.7436 24.1917 44.7679 24.6895C44.7918 25.1868 44.8037 25.6653 44.8037 26.125C44.8037 26.5668 44.7872 27.032 44.7542 27.5206C44.7216 28.0087 44.6506 28.5296 44.5411 29.0833L51.4814 34.1811L45.7029 44.3245L37.9603 40.8712C37.1624 41.5316 36.3144 42.1341 35.4166 42.6786C34.5187 43.2236 33.611 43.6377 32.6934 43.9209L31.5157 52.25H20.0152ZM22.8848 48.7946H28.5966L29.5852 41.2239C31.0262 40.8572 32.3615 40.3191 33.5913 39.6096C34.8214 38.9006 36.0005 37.9965 37.1284 36.8974L44.1939 39.9279L46.9301 35.1223L40.7034 30.4968C40.9024 29.7163 41.0509 28.9717 41.1489 28.2631C41.247 27.5545 41.2961 26.8418 41.2961 26.125C41.2961 25.3788 41.2516 24.6602 41.1627 23.969C41.0742 23.2778 40.9212 22.5569 40.7034 21.8061L46.9831 17.1277L44.2468 12.3221L37.1023 15.3663C36.1513 14.3144 35.0068 13.3868 33.6689 12.5833C32.3311 11.7794 30.9611 11.2603 29.5591 11.0261L28.6461 3.45538H22.8993L21.9897 11C20.5065 11.3126 19.1398 11.828 17.8894 12.5462C16.6386 13.2639 15.4646 14.1905 14.3674 15.3257L7.28406 12.3221L4.54781 17.1277L10.7656 21.7126C10.5552 22.4143 10.3996 23.1319 10.2987 23.8652C10.1975 24.5985 10.1468 25.3605 10.1468 26.1511C10.1468 26.8978 10.1975 27.6288 10.2987 28.3442C10.3996 29.0602 10.5465 29.7777 10.7394 30.4968L4.54781 35.1223L7.28406 39.9279L14.3406 36.9098C15.4218 38.0121 16.5905 38.9194 17.8468 39.6316C19.1031 40.3439 20.4751 40.8833 21.9629 41.25L22.8848 48.7946ZM25.7228 34.0402C27.9242 34.0402 29.7937 33.2713 31.3314 31.7336C32.8691 30.1959 33.638 28.3264 33.638 26.125C33.638 23.9236 32.8691 22.0541 31.3314 20.5164C29.7937 18.9787 27.9242 18.2098 25.7228 18.2098C23.5242 18.2098 21.6553 18.9787 20.1162 20.5164C18.5776 22.0541 17.8083 23.9236 17.8083 26.125C17.8083 28.3264 18.5776 30.1959 20.1162 31.7336C21.6553 33.2713 23.5242 34.0402 25.7228 34.0402Z" fill="white"/>
        </svg>
      </button>
      {isSettingsOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '-668px', right: '0px', width: '380px', height: '660px', backgroundColor: '#323232', zIndex: 10 }}>
          {/* Content inside the settings container */}
          <p style={{ color: 'white', padding: '0px', fontFamily: 'Roboto Mono', fontSize: '25px' }}>Settings</p>

          {/* App Settings */}
          <div className="App-Settings" style={{ width: '90%', color: 'white', marginTop: '-25px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>App Settings</h3>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Dark Mode
              <input type="checkbox" checked style={{ marginLeft: '10px' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '10px' }}>
              Language
              <select style={{ marginLeft: '10px', padding: '5px', backgroundColor: '#222', color: 'white' }}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </label>
          </div>

          {/* Account Settings */}
          <div className="Account-Settings" style={{ width: '90%', color: 'white', marginTop: '-10px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '15px' }}>Account Settings</h3>
            <label style={{ display: 'flex', marginBottom: '10px', flexDirection: 'column', gap: 10, marginTop: '10px' }}>
              Change Username
              <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)}  type="text" placeholder="New Username" style={{ padding: '5px', backgroundColor: '#222', color: 'white', width: '150px' }} />
            </label>
            <button onClick={handleUpdateUsername} style={{ marginTop: '0px', padding: '10px 15px', backgroundColor: '#444', color: 'white', border: 'none', cursor: 'pointer' }}>Update Username</button>
            <label style={{ display: 'flex', marginBottom: '10px', flexDirection: 'column', gap: 10, marginTop: '15px' }}>
              Change Password
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  type="password" placeholder="New Password" style={{ padding: '5px', backgroundColor: '#222', color: 'white', width: '150px' }} />
            </label>
            <button onClick={handleUpdatePassword} style={{ marginTop: '0px', padding: '10px 15px', backgroundColor: '#444', color: 'white', border: 'none', cursor: 'pointer' }}>Update Password</button>

            {/* Profile Picture Section */}
            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: 4, marginTop: '5px' }}>
              <p style={{ fontSize: '16px', marginBottom: '10px' }}>Update Profile Picture</p>
              <input type="file" accept="image/*" onChange={handleProfilePicChange} style={{ marginBottom: '10px' }} />
              {profilePic && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
                  <button
                    onClick={handleUpdateProfilePicture}
                    style={{ marginTop: '0px', backgroundColor: '#444', color: 'white', border: 'none', cursor: 'pointer', height: '35px', width: '140px' }}
                  >
                    Update Picture
                  </button>
                  <img src={url || ''} alt="Profile Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white' }} />
                </div>
              )}
            </div>
            <div style={{  color: 'red' }}>
              <button onClick={handleDeleteAccount} style={{ padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', width: '50%', textAlign: 'center', fontWeight: 'bold' }}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
