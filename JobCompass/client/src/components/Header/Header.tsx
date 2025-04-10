import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileBar from "../ProfileBar/ProfileBar.tsx";
import "./Header.scss";

type HeaderMobilityTypes = {
  mobileState: boolean;
  mobileMapMode: boolean;
  setMobileMapMode: React.Dispatch<React.SetStateAction<boolean>>;
  guestUser: { name: string; id: string; savedJobs: any[] } | null;
  loggedIn: boolean;
  handleLogout: () => void;
  user: any;
};

function Header({
  mobileState,
  mobileMapMode,
  setMobileMapMode,
  guestUser,
  loggedIn,
  handleLogout,
  user,
}: HeaderMobilityTypes) {
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // are you home?

  const toggleMapList = () => {
    setMobileMapMode(!mobileMapMode);
  };

  useEffect(() => {}, [location]);

  const savedJobsPath = loggedIn
    ? `/user/${user.userName}/savedJobs`
    : `/guest/${guestUser?.id || ""}/savedJobs`;

  return (
    <header
      className={`homePage__header ${
        mobileState ? "homePage__header--mobile" : ""
      }`}
    >
      <div className="homePage__header__logo">
        <Link to={"/"}>
          <img
            className="homePage__header__logo__image"
            src="/assets/Logo/compassfavicon.png"
            alt="JobCompass Logo"
          />
          <h1>JobCompass</h1>
        </Link>
      </div>

      {mobileState && !isHomePage && (
        <button
          onClick={() => toggleMapList()}
          className="homePage__header--mobile-toggle"
        >
          {mobileMapMode ? (
            <img src="/assets/Icons/listIcon.png" alt="List Icon"></img>
          ) : (
            <img src="/assets/Icons/icon.png" alt="Map Icon"></img>
          )}
        </button>
      )}

      {/* {Guest Saved Jobs} */}
      {/* {!loggedIn && !mobileState && (
        <Link className="homePage__header__register-cta" to={savedJobsPath}>
          Saved Jobs
        </Link>
      )} */}

      <ProfileBar
        user={user}
        handleLogout={handleLogout}
        mobileState={mobileState}
        loggedIn={loggedIn}
      />
    </header>
  );
}
export default Header;
