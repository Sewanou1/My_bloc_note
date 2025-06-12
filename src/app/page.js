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
    fetch("/api/notes")
      .then(res => res.json())
      .then(setNotes)
      .catch(console.error);
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const nouvelleNote = { titre, contenu };

      if (noteIndexToEdit !== null) {
        const noteToEdit = notes[noteIndexToEdit];
        try {
          const res = await fetch("/api/notes", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...nouvelleNote, _id: noteToEdit._id }),
          });

          const updatedNote = await res.json();
          const updatedNotes = [...notes];
          updatedNotes[noteIndexToEdit] = updatedNote;
          setNotes(updatedNotes);
        } catch (err) {
          console.error("❌ Erreur lors de la mise à jour :", err);
        }
      } else {
        // ➤ ENVOYER VERS L’API
        try {
          const res = await fetch("/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nouvelleNote),
          });

          const savedNote = await res.json();
          setNotes([...notes, savedNote]); // Ajouter la note retournée par l’API
          console.log("Note enregistrée avec succès")
        } catch (err) {
          console.error("Erreur d’envoi de la note :", err);
        }
    }

  setShowPopup(false);
  setTitre('');
  setContenu('');
};


  const editNote = (index) => {
    const note=notes[index];
    setTitre(note.titre);
    setContenu(note.contenu);
    setnoteIndexToEdit(index);
    setShowPopup(true);
  }; 

  const removeNote = async (idToRemove) => {
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: idToRemove }),
      });

      if (res.ok) {
        // Mise à jour de l'état local
        setNotes(notes.filter(note => note._id !== idToRemove));
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    }
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
            <button className={styles.delete} onClick={() => removeNote(note._id)}>
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
          <button className={styles.primary} 
            onClick={() => {
                  setnoteIndexToEdit(null); // <== Réinitialise le mode édition
                  setTitre('');
                  setContenu('');
                  setShowPopup(true);
            }}>
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
