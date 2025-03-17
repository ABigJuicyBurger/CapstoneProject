import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="homePage__header">
      <div className="homePage__header__logo">
        <Link to={"/"}>
          <img
            className="homePage__header__logo__image"
            src="/src/assets/Logo/compassfavicon.png"
            alt=""
          />

          <h1>JobCompass</h1>
        </Link>
      </div>
      <Link
        className="homePage__header__register-cta"
        to={"/user/:id/savedJobs"}
      >
        Saved Jobs
      </Link>
      <Link className="homePage__header__signIn-cta" to={"/signIn"}>
        Sign In
      </Link>
      <Link className="homePage__header__register-cta" to={"/register"}>
        Register
      </Link>
    </header>
  );
}

export default Header;
