import express from "express";
import {
  createNote,
  getNotes,
  getAllNotes,
  deleteNote,
  updateNote
} from '../controller/Notes.js';
import authMiddleware from "../middleware/authMiddleware.js";
import upload from '../middleware/uploadMemory.js';
const router = express.Router();

// router.post('/create', authMiddleware,upload.single('image'), createNote);

router.post('/create', authMiddleware, upload.single('image'), createNote);
// router.put('/:id', authMiddleware, updateNote);    
router.delete('/:id', authMiddleware, deleteNote); 
router.get('/', authMiddleware, getNotes);
router.post('/all', authMiddleware, getAllNotes);
router.put('/:id', authMiddleware, upload.single('image'), updateNote);

export default router;
