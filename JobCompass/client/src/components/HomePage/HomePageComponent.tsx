import { Link } from "react-router-dom";
import { JSX } from "react";

import "./HomePageComponent.scss";

function HomePage(): JSX.Element {
  return (
    <div className="homePage">
      <main className="heroPage">
        <h1 className="heroPage__title">JobCompass</h1>
        <h2 className="heroPage__text">Let's Help You Find Your Next Job</h2>
        <Link className="heroPage__guest-cta" to={"/jobs"}>
          Visit Map
        </Link>
        <video className="heroPage__demo" autoPlay loop muted controls>
          <source className="video" src="/assets/demo.mp4" type="video/mp4" />
        </video>
      </main>
      <footer className="homePage__footer">
        <p>
          &copy; {new Date().getFullYear()} Made by{" "}
          <a href="https://github.com/ABigJuicyBurger/JobCompass">
            ABigJuicyBurger
          </a>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
