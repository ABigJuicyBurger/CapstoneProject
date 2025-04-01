import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { JSX } from "react";
import MapJobCardNoteType from "../../../types/MapJobCardType";

import AddNote from "./NoteFunctions/AddNote.tsx";

import "../JobNote/JobNote.scss";

function JobNote({
  updateNoteVisibility = () => {},
  jobId,
}: MapJobCardNoteType): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Job id from url", id);

  const handleBack = () => {
    updateNoteVisibility();
  };

  // TODO: note state; for now keep it guest status (where user has no saveable notes)
  const [noteList, setNoteList] = useState<string[]>(() => {
    try {
      const storageKey = `job-notes-${id}`;
      console.log("Looking for notes with key:", storageKey);

      const savedNotes = localStorage.getItem(`job-notes-${id}`);
      console.log("Found saved notes:", savedNotes);

      const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];
      return Array.isArray(parsedNotes) ? parsedNotes : [];
    } catch (error) {
      console.error("Error loading notes from localStorage:", error);

      return [];
    }
  });
  const [viewOneNote, setViewOneNote] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<number>(0);
  const MAX_LENGTH = 5;

  const addNote = (newNote: string): void => {
    const updatedNotes = [...noteList, newNote];
    setNoteList(updatedNotes);
    localStorage.setItem(`job-notes-${id}`, JSON.stringify(updatedNotes));
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
        <button className="note-back-button" onClick={handleBack}></button>
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
                    {noteList &&
                      noteList.map((note, index) => (
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
