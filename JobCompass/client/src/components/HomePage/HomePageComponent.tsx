import { Link } from "react-router-dom";
import { JSX } from "react";

import "./HomePageComponent.scss";
import Header from "../Header/Header";

function HomePage(): JSX.Element {
  return (
    <div className="homePage">
      {/* <header className="homePage__header">
        <Link className="homePage__header__signIn-cta" to={"/signIn"}>
          Sign In
        </Link>
        <Link className="homePage__header__register-cta" to={"/register"}>
          Register
        </Link>
      </header> */}
      <Header />
      <main className="heroPage">
        <h1 className="heroPage__title">JobCompass</h1>
        <h2 className="heroPage__text">Let's Help You Find Your Next Job</h2>
        <Link className="heroPage__guest-cta" to={"/jobs"}>
          Try Our Page Out!
        </Link>
      </main>
    </div>
  );
}

export default HomePage;
