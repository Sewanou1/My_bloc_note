import { connectMongo } from "../../lib/mongodb";
import Note from "../../models/Note";

async function init() {
  try {
    await connectMongo();
    console.log("✔️ Connexion réussie !");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
  }
}

init();

export async function GET() {
  await connectMongo();
  const notes = await Note.find();
  console.log(notes)
  return Response.json(notes);
}

export async function POST(req) {
  const data = await req.json();
  await connectMongo();
  const note = await Note.create(data);
  return Response.json(note);
}

export async function PUT(req) {
  try {
    await connectMongo();
    const { _id, titre, contenu } = await req.json();

    const updatedNote = await Note.findByIdAndUpdate(
      _id,
      { titre, contenu },
      { new: true }
    );

    return Response.json(updatedNote);
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour :", err);
    return Response.json({ message: "Erreur serveur" }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    await connectMongo();
    const { id } = await req.json(); // On extrait l'ID de la requête

    await Note.findByIdAndDelete(id);

    console.log("Note supprimée avec succès");
    return Response.json({ message: "Note supprimée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    return Response.json({ error: "Erreur de suppression" }, { status: 500 });
  }
}



