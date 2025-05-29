"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState,useEffect } from "react";

export default function Home() {

  const [showPopup, setShowPopup] = useState(false);
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [notes, setNotes] = useState([]);
  

  useEffect(() => {
    const savedNotes = localStorage.getItem("mes_notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Titre:", titre);
    console.log("Contenu:", contenu);
    console.log("Notes",notes)
    // Ici tu peux ajouter la logique pour enregistrer dans un état, une base de données, etc.

    const nouvelleNote = { titre, contenu };
    const updatedNotes = [...notes, nouvelleNote];
    setNotes(updatedNotes);
    localStorage.setItem("mes_notes", JSON.stringify(updatedNotes));

    
    setShowPopup(false); // Ferme le popup
    setTitre('');
    setContenu('');
  };

  
    const removeNote = (indexToRemove) => {
      const filteredNotes = notes.filter((_, index) => index !== indexToRemove);
      setNotes(filteredNotes);
      localStorage.setItem("mes_notes", JSON.stringify(filteredNotes));
    }; 

  return (
    <div className={styles.page}>
          <h2 className={styles.titre}>Bloc Note</h2>

      <main className={styles.main}>

      
{notes.map((note, index) => (
  <div key={index} className={styles.note}>
    <div>
    <h4>{note.titre}</h4>
    <p>{note.contenu}</p>
  </div>
    <button className={styles.delete} onClick={() => removeNote(index)}>
      <Image
        aria-hidden
        src="/delete.svg"
        alt="delete icon"
        width={50}
        height={50}
      />
    </button>
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
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
