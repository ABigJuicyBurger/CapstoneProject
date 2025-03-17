import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { JSX } from "react";
import MapJobCardNoteType from "../../../types/MapJobCardType";

import AddNote from "./AddNote.js";

function JobNote({ noteState, updateNote }: MapJobCardNoteType): JSX.Element {
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
          {noteList.length > 0 ? (
            <div>
              <AddNote />
              {noteList}
            </div>
          ) : (
            <div>
              <h3>No notes yet. Want to add one?</h3>
              <AddNote />
            </div>
          )}
        </section>
        <div className="jobCard__header__cta">
          {/* <button onClick={saveJob}> Save job </button> */}
          {/* <button onClick={() => addNote}> Add Note </button> */}
        </div>
      </div>
    </div>
  );
}

export default JobNote;
