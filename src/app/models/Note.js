import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  titre: String,
  contenu: String,
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
