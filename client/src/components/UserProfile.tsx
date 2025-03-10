import { FaRegEdit } from "react-icons/fa";
import DropzoneComponent from "./Dropzone";
import { useEffect, useState } from "react";
import { IMAGES_URL } from "../constants/files";

interface UserProfileProps {
  username: string;
  email: string;
  profilePhoto: string | null;
  onSaveProfile: (
    updatedUsername: string,
    updatedEmail: string,
    updatedProfilePhoto: File | null
  ) => void;
}

const UserProfile = ({
  username,
  email,
  profilePhoto,
  onSaveProfile,
}: UserProfileProps) => {
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setnewEmail] = useState(email);
  const [newProfilePhoto, setNewProfilePhoto] = useState<File | null>(null);

  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  useEffect(() => {
    setnewEmail(email)
  }, [email])

  const handleSave = async () => {
    onSaveProfile(newUsername, newEmail, newProfilePhoto);
    setEditMode(false);
    setNewProfilePhoto(null);
    setNewUsername(username);
    setnewEmail(email);
  };

  return (
    <div
      className="post card px-3"
      style={{ minHeight: "90vh", borderWidth: 0, borderRadius: 0 }}
    >
      <div className="card-body">
        {<div className="d-flex justify-content-between align-items-center row">
          <h3 className="card-title col-10">User Details</h3>
          <button
            className="btn btn-light col-2"
            style={{ border: "none", background: "transparent" }}
            onClick={() => setEditMode((prev) => !prev)}
          >
            <FaRegEdit size={20} />
          </button>
        </div>}

        {editMode ? (
          <div>
            <div className="mb-3">
              <div className="mb-3">
                <DropzoneComponent
                  onFileSelect={(file) => setNewProfilePhoto(file)}
                  selectedFile={newProfilePhoto}
                />
              </div>
              <div className="my-3">
                <label htmlFor="username" className="form-label">
                  Email
                </label>
                <input
                  style={{ borderRadius: "50px" }}
                  type="text"
                  className="form-control"
                  value={newEmail}
                  onChange={(e) => setnewEmail(e.target.value)}
                />
              </div>
              <div className="my-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  style={{ borderRadius: "50px" }}
                  type="text"
                  className="form-control"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary w-100" onClick={handleSave}>
              Save
            </button>
          </div>
        ) : (
          <div>
            <div className="justify-content-center row">
              <img
                src={
                  profilePhoto ? IMAGES_URL + profilePhoto : "/temp-user.png"
                }
                alt="Profile"
                className="rounded-circle img-fluid p-0 my-3"
                style={{ width: "250px", height: "250px" }}
              />
            </div>
            <p>
              <strong>Email:</strong> {email}
            </p>
            <p>
              <strong>Username:</strong> {username}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
