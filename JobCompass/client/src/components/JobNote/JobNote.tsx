import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { JSX } from "react";

type JobNoteProps = {
  updateNote: () => void;
  note: boolean;
};

function JobNote({ updateNote, note }: JobNoteProps): JSX.Element {
  const { id } = useParams();
  console.log("Job id from url", id);

  // TODO: note state; for now keep it guest status (where user has no saveable notes)
  const [noteList, setNoteList] = useState([]);

  return (
    <div className="jobCard">
      <div className="jobCard__header">
        <Link to={`/jobs/${id}`} onClick={() => updateNote()}>
          <img
            className="jobCard__header__goBack"
            src="/src/assets/Icons/arrow-right-solid.svg"
            alt="arrow"
          />
        </Link>
        <h2 className="jobCard__header__title">Notes</h2>
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
          <button onClick={() => addNote}> Add Note </button>
        </div>
      </div>
    </div>
  );
}

export default JobNote;
