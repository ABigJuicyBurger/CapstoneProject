import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
type HeaderMobilityTypes = {
  mobileState: boolean;
  mobileMapMode: boolean;
  setMobileMapMode: React.Dispatch<React.SetStateAction<boolean>>;
  guestUser: { name: string; id: string; savedJobs: any[] } | null;
};

function Header({
  mobileState,
  mobileMapMode,
  setMobileMapMode,
  guestUser,
}: HeaderMobilityTypes) {
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // are you home?

  const toggleMapList = () => {
    setMobileMapMode(!mobileMapMode);
  };

  useEffect(() => {}, [location]);

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
            alt=""
          />
          <h1>JobCompass</h1>
        </Link>
      </div>
      {mobileState && !isHomePage && (
        <button
          onClick={() => toggleMapList()}
          className="homePage__header--mobile-toggle"
        >
          {mobileMapMode ? "View Jobs" : "View Map"}
        </button>
      )}
      <Link
        className="homePage__header__register-cta "
        to={guestUser ? `guest/savedJobs` : `user/:id/savedJobs`}
      >
        Saved Jobs
      </Link>
      <Link
        className="homePage__header__signIn-cta construction"
        to={"/signIn"}
      >
        Sign In
      </Link>
      <Link
        className="homePage__header__register-cta construction"
        to={"/register"}
      >
        Register
      </Link>
    </header>
  );
}

export default Header;
