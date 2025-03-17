import { useState } from "react";
import "./JobNote.scss";

function AddNote() {
  const [notePad, setNotePad] = useState<string | null>(null);
  const [isNotepadVisible, setIsNotepadVisible] = useState<boolean>(false);

  const showNotePad: () => void = () => {
    console.log("Clicked");
    setIsNotepadVisible(true);
  };

  return (
    <div className="jobCard__header__cta">
      <button onClick={() => showNotePad()}>Add Note</button>
      {isNotepadVisible && (
        <div className="notePad">
          <form action="">
            <label htmlFor="">
              {" "}
              Enter note here
              <input type="text" />
            </label>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddNote;
