import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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

  console.log(user);

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
      <Link className="homePage__header__register-cta " to={savedJobsPath}>
        Saved Jobs
      </Link>
      {!loggedIn ? (
        <>
          <Link className="homePage__header__signIn-cta" to={"/signIn"}>
            Sign In
          </Link>
          <Link className="homePage__header__register-cta" to={"/register"}>
            Register
          </Link>
        </>
      ) : (
        <>
          <Link className="homePage__header__register-cta" to={"/profile"}>
            Profile
          </Link>
          <Link
            className="homePage__header__register-cta"
            onClick={handleLogout}
            to={"/"}
          >
            Logout
          </Link>
        </>
      )}
    </header>
  );
}
export default Header;
