import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { JSX } from "react";
import MapJobCardNoteType from "../../../types/MapJobCardType";

import AddNote from "./NoteFunctions/AddNote.tsx";

import "../JobNote/JobNote.scss";

function JobNote({ updateNoteVisibility }: MapJobCardNoteType): JSX.Element {
  const { id } = useParams();
  console.log("Job id from url", id);

  // TODO: note state; for now keep it guest status (where user has no saveable notes)
  const [noteList, setNoteList] = useState<string[]>([]);
  const [viewOneNote, setViewOneNote] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<number>(0);

  const addNote = (newNote: string): void => {
    setNoteList((oldNotes) => [...oldNotes, newNote]);
  };

  const deleteSingleNote = (noteToDelete: string): void => {
    setNoteList((prevNotes) =>
      prevNotes.filter((note) => note !== noteToDelete)
    );
  };

  const viewSingleNote = (index: number): void => {
    setSelectedNote(index);
    setViewOneNote(true);
  };

  const viewAllNotes = (): void => {
    setViewOneNote(false);
  };

  console.log(noteList);

  return (
    <div className="jobCard">
      <div className="jobCard__header">
        <Link to={`/jobs/${id}`} onClick={() => updateNoteVisibility()}>
          <img
            className="jobCard__header__goBack"
            src="/src/assets/Icons/arrow-right-solid.svg"
            alt="arrow"
          />
        </Link>
        <h2 className="jobCard__header__title">Notes</h2>
        <section className="jobCard__content">
          {noteList.length > 0 ? (
            <div className="jobCard__notes">
              {viewOneNote && selectedNote !== null ? (
                // single note view
                <div className="jobCard__header__notes__single">
                  <button
                    className="jobCard__notes__button"
                    onClick={() => viewAllNotes()}
                  >
                    Back to the rest
                  </button>
                  <p className="jobCard__notes__text">
                    {noteList[selectedNote]}
                  </p>
                </div>
              ) : (
                // all notes view
                <div className="jobCard__notes__list">
                  <AddNote addNote={addNote} />
                  <ul className="jobCard__notes__items">
                    {noteList.map((note, index) => (
                      <li key={index} className="jobCard__notes__item">
                        <p className="jobCard__notes__item-text">{note}</p>
                        <div className="jobCard__notes__item-actions">
                          <button
                            onClick={() => viewSingleNote(index)}
                            className="jobCard__notes__item-button"
                          >
                            View
                          </button>
                          <button
                            onClick={() => deleteSingleNote(note)}
                            className="jobCard__notes__item-button"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="jobCard__notes--empty">
              <h3 className="jobCard__notes__heading">
                No notes yet. Want to add one?
              </h3>
              <AddNote addNote={addNote} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export default JobNote;
