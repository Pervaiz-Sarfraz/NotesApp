import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/store";
import { toast } from "react-toastify";
import { RiStickyNoteLine } from "react-icons/ri";

const CreateNotes = () => {
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addNote, Notes, updateNote } = useProductStore();

  useEffect(() => {
    if (id) {
      const existingNote = Notes.find((note) => note._id === id);
      if (existingNote) {
        setNoteData({
          title: existingNote.title,
          content: existingNote.content,
          image: null,
        });
        if (existingNote.imageUrl) {
          setPreviewImage(existingNote.imageUrl);
        }
      } else {
        toast.error("Note not found");
        navigate("/");
      }
    }
  }, [id, Notes, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setNoteData({ ...noteData, image: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, content, image } = noteData;

    if (!title || !content) {
      toast.warning("Please fill in both title and content.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      setIsLoading(true);
      const result = id ? await updateNote(id, formData) : await addNote(formData);
      setIsLoading(false);

      if (result?.success) {
        toast.success(id ? "Note updated successfully!" : "Note added successfully!");
        navigate("/");
      } else {
        toast.error(result?.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[#121212] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1e1e1e] border border-[#2c2c2c] rounded-xl shadow-lg p-6 w-full max-w-2xl flex flex-col gap-5"
      >
        <div className="flex flex-col items-center mb-2">
          <RiStickyNoteLine className="text-[#43CBFF] text-4xl mb-2" />
          <h2 className="text-white text-2xl font-semibold text-center">
            {id ? "Edit Note" : "Create New Note"}
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Title</label>
          <input
            type="text"
            className="p-3 rounded-lg bg-[#2c2c2c] border border-[#3d3d3d] text-white focus:outline-none focus:ring-1 focus:ring-[#43CBFF] placeholder-gray-500"
            placeholder="Note title..."
            value={noteData.title}
            onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Content</label>
          <textarea
            rows="6"
            className="p-3 rounded-lg bg-[#2c2c2c] border border-[#3d3d3d] text-white focus:outline-none focus:ring-1 focus:ring-[#9708CC] placeholder-gray-500"
            placeholder="Write your content here..."
            value={noteData.content}
            onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">Upload Image</label>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-[#2c2c2c] border border-[#3d3d3d] text-gray-300 rounded-lg hover:bg-[#3d3d3d] transition">
                Choose File
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {previewImage && (
              <span className="text-gray-400 text-sm">Image selected</span>
            )}
          </div>
        </div>

        {previewImage && (
          <div className="mt-2 rounded-lg overflow-hidden border border-[#3d3d3d] max-w-xs">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!noteData.title || !noteData.content || isLoading}
          className={`mt-4 py-3 px-6 bg-gradient-to-r from-[#43CBFF] to-[#9708CC] text-white font-medium rounded-lg hover:opacity-90 transition ${
            (!noteData.title || !noteData.content || isLoading) && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : id ? "Update Note" : "Save Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNotes;