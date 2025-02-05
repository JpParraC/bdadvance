import { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CFormInput,
  CFormLabel,
  CAvatar,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from "@coreui/react";
import '../../css/styles.css';
import jwtDecode from "jwt-decode";

const MyProfile = () => {
  const [selectedIcon, setSelectedIcon] = useState("default-avatar.png");
  const [profile, setProfile] = useState({
    id_staff: "",
    name_staff: "",
    lastname_staff: "",
    rol_id: "",
    email_staff: "",
    phone: "",
  });

  const [modalVisible, setModalVisible] = useState(false); // Modal state

  // Load profile data from localStorage and set icon based on gender
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedGen = localStorage.getItem("gen");
    const token = localStorage.getItem("token");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile({
        id_staff: user.staff_id,
        name_staff: user.name,
        lastname_staff: user.lastname,
        rol_id: user.role_id, // Ensure rol_id is a valid number
        email_staff: user.email,
        phone: user.phone,
      });
    }

    let gender = storedGen ? storedGen.toLowerCase() : "";
    if (!gender && token) {
      const decodedToken = jwtDecode(token);
      gender = decodedToken.gen ? decodedToken.gen.toLowerCase() : "";
    }

    if (gender === "m") {
      setSelectedIcon("./src/assets/images/avatars/avatarman.png");
    } else if (gender === "f") {
      setSelectedIcon("./src/assets/images/avatars/avatarfemale.png");
    }
  }, []);

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Save changes to backend and localStorage
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      // Make the PUT request to update the profile on the server
      const response = await fetch(`http://localhost:5000/api/admins/${profile.id_staff}`, {
        method: 'PUT', // or PATCH depending on the backend
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const updatedProfile = await response.json();

        // Save the updated profile to localStorage
        localStorage.setItem("user", JSON.stringify(updatedProfile));

        // Update the profile in the component state
        setProfile(updatedProfile);

        // Close the modal
        setModalVisible(false);

        alert("Profile updated successfully!");
      } else {
        console.error("Error updating profile");
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <CCard className="profile-card">
      <CCardBody className="profile-body">
        <div className="profile-container">
          <CAvatar className="profile-avatar">
            <img src={selectedIcon} alt="Profile Icon" className="avatar-img" />
          </CAvatar>

          <div className="profile-info">
            <CFormLabel>ID</CFormLabel>
            <CFormInput className="profile-input" value={profile.id_staff} readOnly />
          </div>
          <div className="profile-info">
            <CFormLabel>First Name</CFormLabel>
            <CFormInput className="profile-input" value={profile.name_staff} readOnly />
          </div>
          <div className="profile-info">
            <CFormLabel>Last Name</CFormLabel>
            <CFormInput className="profile-input" value={profile.lastname_staff} readOnly />
          </div>
          <div className="profile-info">
            <CFormLabel>Role</CFormLabel>
            <CFormSelect
              className="profile-input"
              name="rol_id"
              value={profile.rol_id || ""} // Ensure it's always a valid value
              onChange={handleInputChange}
            >
              <option value="1">Administrator</option>
              <option value="2">Receptionist</option>
            </CFormSelect>
          </div>
          <div className="profile-info">
            <CFormLabel>Email</CFormLabel>
            <CFormInput className="profile-input" value={profile.email_staff} readOnly />
          </div>
          <div className="profile-info">
            <CFormLabel>Phone</CFormLabel>
            <CFormInput className="profile-input" value={profile.phone} readOnly />
          </div>

          <CButton className="buttonnn" color="primary" onClick={() => setModalVisible(true)}>Edit Profile</CButton>
        </div>
      </CCardBody>

      {/* Modal for editing profile */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormLabel>First Name</CFormLabel>
          <CFormInput name="name_staff" value={profile.name_staff} onChange={handleInputChange} />

          <CFormLabel>Last Name</CFormLabel>
          <CFormInput name="lastname_staff" value={profile.lastname_staff} onChange={handleInputChange} />

          <CFormLabel>Role</CFormLabel>
          <CFormSelect
            name="rol_id"
            value={profile.rol_id || ""} // Ensures it's always a valid value
            onChange={handleInputChange}
          >
            <option value="1">Administrator</option>
            <option value="2">Receptionist</option>
          </CFormSelect>

          <CFormLabel>Email</CFormLabel>
          <CFormInput name="email_staff" value={profile.email_staff} onChange={handleInputChange} />

          <CFormLabel>Phone</CFormLabel>
          <CFormInput name="phone" value={profile.phone} onChange={handleInputChange} />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={handleSaveChanges}>Save Changes</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default MyProfile;
