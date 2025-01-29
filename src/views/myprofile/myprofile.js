import { useState } from "react";
import { CCard, CCardBody, CFormInput, CFormSelect, CAvatar, CFormLabel } from "@coreui/react";

const MyProfile = () => {
  const [selectedIcon, setSelectedIcon] = useState("default-avatar.png");
  
  const profile = {
    id_staff: "1",
    name_staff: "Juan",
    lastname_staff: "Pérez",
    rol_id: 1,
    email_staff: "juan.perez@example.com",
    phone: "555-1234",
  };

  return (
    <CCard className="max-w-lg mx-auto p-6 shadow-lg rounded-xl">
      <CCardBody>
        <div className="flex flex-col items-center gap-4">
          <CAvatar className="w-24 h-24">
            <img src={selectedIcon} alt="Profile Icon" className="rounded-full" />
          </CAvatar>
          <CFormSelect value={selectedIcon} onChange={(e) => setSelectedIcon(e.target.value)}>
            <option value="default-avatar.png">Default</option>
            <option value="avatar1.png">Avatar 1</option>
            <option value="avatar2.png">Avatar 2</option>
          </CFormSelect>
          <div className="w-full">
            <CFormLabel>ID</CFormLabel>
            <CFormInput value={profile.id_staff} readOnly />
          </div>
          <div className="w-full">
            <CFormLabel>Nombre</CFormLabel>
            <CFormInput value={profile.name_staff} readOnly />
          </div>
          <div className="w-full">
            <CFormLabel>Apellido</CFormLabel>
            <CFormInput value={profile.lastname_staff} readOnly />
          </div>
          <div className="w-full">
            <CFormLabel>Cargo</CFormLabel>
            <CFormInput value={profile.rol_id === 1 ? "Administrator" : "Recepcionist"} readOnly />
          </div>
          <div className="w-full">
            <CFormLabel>Correo</CFormLabel>
            <CFormInput value={profile.email_staff} readOnly />
          </div>
          <div className="w-full">
            <CFormLabel>Teléfono</CFormLabel>
            <CFormInput value={profile.phone} readOnly />
          </div>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default MyProfile;
