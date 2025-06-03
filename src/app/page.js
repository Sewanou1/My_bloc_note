"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState,useEffect } from "react";

export default function Home() {

  const [showPopup, setShowPopup] = useState(false);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [notes, setNotes] = useState([]);
  const [noteIndexToEdit, setnoteIndexToEdit]= useState(null);
  

  useEffect(() => {
    const savedNotes = localStorage.getItem("mes_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Titre:", titre); // pour le deburgage
    console.log("Contenu:", contenu); // pour le deburgage
    console.log("Notes",notes)    // pour le deburgage 
    const nouvelleNote = { titre, contenu };
    // Modification
    if(noteIndexToEdit!==null){
      const updatedNotes = [...notes];
      updatedNotes[noteIndexToEdit]=nouvelleNote;
      setNotes(updatedNotes);
      localStorage.setItem("mes_notes",JSON.stringify(updatedNotes));
    }else{
     // Ajout   
    const updatedNotes = [...notes, nouvelleNote];
    setNotes(updatedNotes);
    localStorage.setItem("mes_notes", JSON.stringify(updatedNotes));
    }

    
    setShowPopup(false); // Ferme le popup
    setTitre('');
    setContenu('');
    setnoteIndexToEdit(null);
  };

  const editNote = (index) => {
    const note=notes[index];
    setTitre(note.titre);
    setContenu(note.contenu);
    setnoteIndexToEdit(index);
    setShowPopup(true);
  }; 

  const removeNote = (indexToRemove) => {
    const filteredNotes = notes.filter((_, index) => index !== indexToRemove);
    setNotes(filteredNotes);
    localStorage.setItem("mes_notes", JSON.stringify(filteredNotes));
  }; 

  return (
    <div className={styles.page}>
          <h2 className={styles.titre}>Mon Bloc Note</h2>

      <main className={styles.main}>

            
      {notes.map((note, index) => (
        <div key={index} className={styles.note}>
          <div>
            <h4>{note.titre}</h4>
            <p>{note.contenu}</p>
          </div>

          <div className={ styles.divButton }>
            <button className={styles.delete} onClick={() => removeNote(index)}>
              <Image
                aria-hidden
                src="/delete.svg"
                alt="delete icon"
                width={20}
                height={20}
              />
            </button>

            <button className={styles.edit} onClick={() => editNote(index)}>
              <Image
                aria-hidden
                src="/edit.svg"
                alt="edit icon"
                width={20}
                height={20}
              />
            </button>
          </div>

        </div>
      ))}
      
        <div className={styles.ctas}>
          <button className={styles.primary} onClick={() => setShowPopup(true)}>
            Ajouter une note
          </button>
        </div>

        {showPopup && (
          <div className={styles.popup}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h3>Nouvelle note</h3>
              <input
                type="text"
                placeholder="Titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
              <textarea
                placeholder="Contenu"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
              />
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={() => setShowPopup(false)}>Annuler</button>
            </form>

          </div>
        )}


      </main>
      <footer className={styles.footer}>

      </footer>
    </div>
  );
}
