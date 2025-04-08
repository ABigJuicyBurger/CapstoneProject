import { useState } from "react";
import { Link } from "react-router-dom";

type ProfileBarType = {
  user: any;
  handleLogout: () => void;
};
const ProfileBar = ({ user, handleLogout }: ProfileBarType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="homePage__header-cta">
      <div onClick={toggleBar}>
        <img src="null" alt="openTaskbar" />
        <img src="null" alt="Avatar" />
      </div>
      {isOpen && (
        <div className="profile-dropdown">
          <Link className="homePage__header__register-cta" to={"/profile"}>
            {user.userName}
          </Link>
          <Link
            className="homePage__header__register-cta"
            onClick={handleLogout}
            to={"/"}
          >
            Logout
          </Link>
        </div>
      )}
    </nav>
  );
};

export default ProfileBar;
