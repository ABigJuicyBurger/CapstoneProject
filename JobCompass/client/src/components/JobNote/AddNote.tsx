import { useState } from "react";
import "./JobNote.scss";

function AddNote({ addNote }: { addNote: (notes: string) => void }) {
  const [notePad, setNotePad] = useState<{ note: string }>({
    note: "",
  });
  const [isNotepadVisible, setIsNotepadVisible] = useState<boolean>(false);

  const showNotePad: () => void = () => {
    console.log("Clicked");
    setIsNotepadVisible(true);
  };

  function handleNoteChange(e: React.ChangeEvent<HTMLInputElement>) {
    // instead of type string it's a change input element
    setNotePad({ note: e.target.value });
  }

  function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
    setNotePad({ note: "" });
    setIsNotepadVisible(false);
  }

  function handleNoteSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(notePad);
    setIsNotepadVisible(false);
    addNote(notePad.note);
  }

  return (
    <div className="jobCard__header__cta">
      <button onClick={() => showNotePad()}>Add Note</button>
      {isNotepadVisible && (
        <div className="jobCard__notepad">
          <form className="jobCard__notepad__form" onSubmit={handleNoteSubmit}>
            <label htmlFor="Note">Enter note here</label>
            <input
              type="text"
              name="note"
              value={notePad.note}
              onChange={handleNoteChange}
              placeholder="Commute time maybe?"
            ></input>
            <section className="jobCard__notepad__cta">
              <button>Add</button>
              <button onClick={handleCancel}>Cancel</button>
            </section>
          </form>
        </div>
      )}
    </div>
  );
}
export default AddNote;
