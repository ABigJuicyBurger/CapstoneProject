import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { JSX } from "react";
import MapJobCardNoteType from "../../../types/MapJobCardType";

import AddNote from "./AddNote.tsx";

function JobNote({ noteState, updateNote }: MapJobCardNoteType): JSX.Element {
  const { id } = useParams();
  console.log("Job id from url", id);

  // TODO: note state; for now keep it guest status (where user has no saveable notes)
  const [noteList, setNoteList] = useState([]);

  const addNote = () => {};

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
        {/* <div className="jobCard__header__cta"></div> */}
      </div>
    </div>
  );
}

export default JobNote;
