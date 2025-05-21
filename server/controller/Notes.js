import Note from "../models/Notes.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { uploadFileToR2, getPublicUrl } from "../uploadToR2.js";


const getTokenFromHeader = (req) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};


export const createNote = async (req, res) => {
  const token = getTokenFromHeader(req);
  const { title, content } = req.body;

  if (!title || !content || !req.file) {
    return res.status(400).json({ success: false, message: "Please provide title, content and image" });
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const uniqueFileName = `media_resources/${uuidv4()}-${req.file.originalname}`;

    await uploadFileToR2(req.file.buffer, uniqueFileName, req.file.mimetype);
    const fileUrl = getPublicUrl(uniqueFileName);

    const note = new Note({
      title,
      content,
      image: fileUrl,
      user: decoded.userId,
    });

    await note.save();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create Note Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getNotes = async (req, res) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const notes = await Note.find({ user: decoded.userId }).sort({ createdAt: -1 });

       res.status(200).json(notes);

  } catch (error) {
    console.error("Get Notes Error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const token = getTokenFromHeader(req);

  if (!token) return res.status(401).json({ success: false, message: "Authentication token is missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const note = await Note.findById(id);

    if (!note || note.user.toString() !== decoded.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized or Note not found" });
    }

    await Note.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.log("Delete Note Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const token = getTokenFromHeader(req);

  if (!token) return res.status(401).json({ success: false, message: "Authentication token is missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const note = await Note.findById(id);

    if (!note || note.user.toString() !== decoded.userId) {
      return res.status(403).json({ success: false, message: "Unauthorized or Note not found" });
    }

    if (typeof title !== "undefined") note.title = title;
    if (typeof content !== "undefined") note.content = content;

    const updatedNote = await note.save();
    res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    console.log("Update Note Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().populate("user", "name email");
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
