// src/contexts/NoteContext.tsx
import { createContext, useState, ReactNode } from "react";

type NoteContextType = {
  note: boolean;
  updateNote: () => void;
};

// Create with default values
export const NoteContext = createContext<NoteContextType>({
  note: false,
  updateNote: () => {},
});

// Create a provider component
export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [note, setNote] = useState(false);
  const updateNote = () => setNote(!note);

  return (
    <NoteContext.Provider value={{ note, updateNote }}>
      {children}
    </NoteContext.Provider>
  );
};
