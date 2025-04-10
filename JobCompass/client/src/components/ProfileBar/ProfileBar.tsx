import { useState } from "react";
import { Link } from "react-router-dom";
import "./ProfileBar.scss";

type ProfileBarType = {
  user: any;
  handleLogout: () => void;
  mobileState: boolean;
  loggedIn: boolean;
};
const ProfileBar = ({
  user,
  handleLogout,
  mobileState,
  loggedIn,
}: ProfileBarType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleBar = () => {
    setIsOpen(!isOpen);
  };

  // Get the first letter of the username for the avatar
  const avatarLetter = user?.userName
    ? user.userName.charAt(0).toUpperCase()
    : "";

  return (
    <div className="profile-bar">
      <button className="profile-bar__button" onClick={toggleBar}>
        <div className="profile-bar__avatar">{avatarLetter}</div>
        <span className="profile-bar__name">{user?.userName}</span>
      </button>

      {isOpen && (
        <div className="profile-bar__dropdown">
          <div className="profile-bar__dropdown-content">
            {loggedIn ? (
              <Link
                to={`/user/${user.userName}/profile`}
                className="profile-bar__link"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  className="profile-bar__link"
                  to={"/signIn"}
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  className="profile-bar__link"
                  to={"/register"}
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to={`/user/${user.userName}/savedJobs`}
              className="profile-bar__link"
              onClick={() => setIsOpen(false)}
            >
              Saved Jobs
            </Link>
            {loggedIn && (
              <button
                className="profile-bar__logout-button"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBar;
