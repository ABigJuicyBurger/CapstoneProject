import { Link, useParams } from "react-router-dom";
function JobNote() {
  return (
    <div className="jobCard">
      <div className="jobCard__header">
        <Link to={"/jobs"}>
          <img
            className="jobCard__header__goBack"
            src="/src/assets/Icons/arrow-right-solid.svg"
            alt="arrow"
            onClick={onClose}
          />
        </Link>
        <h2 className="jobCard__header__title">{job.title}</h2>
        <section className="jobCard__header__title__company">
          {/* <h3 className="jobCard__header__company">{job.company}</h3>
                  <img
                    src="/  "
                    className="jobCard__header__logo-placeholder"
                    alt="logo"
                  /> */}
        </section>
        <div className="jobCard__header__cta">
          {/* <button onClick={saveJob}> Save job </button> */}
          <button onClick={() => console.log("hi")}> View Note </button>
        </div>
      </div>
    </div>
  );
}

export default JobNote;
