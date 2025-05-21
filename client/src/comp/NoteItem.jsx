import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/store";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const NoteItem = ({ note }) => {
  const { deleteNote } = useProductStore();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    const result = await deleteNote(note._id);
    if (result.success) {
      toast.success("Note deleted successfully");
      window.location.reload();
    } else {
      toast.error(result.message || "Failed to delete note");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit-note/${note._id}`);
  };

  return (
    <div className="relative group h-full">
      <div
        className="block h-full"
      >
        <div className="h-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] hover:from-[#252525] hover:to-[#303030] transition-all duration-200 p-4 rounded-xl flex flex-col justify-between border border-[#2c2c2c] overflow-hidden shadow-lg hover:shadow-xl hover:border-[#43CBFF]/30">

          <div className="relative z-10 flex flex-col h-full">
           <div className="flex justify-between">
                  <h4 className="text-white font-semibold text-lg mb-2 truncate bg-clip-text bg-gradient-to-r from-[#43CBFF] to-[#9708CC]">
              {note.title || "Untitled Note"}
            </h4>
            {note.image && (
              <div className="mb-3 flex justify-center">
                <img
                  src={note.image}
                  alt="Note logo"
                  className="w-[60px] h-14 object-cover rounded-full border-2 border-[#3d3d3d] shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
           </div>
            <p className="text-gray-300 text-sm mb-3 line-clamp-3 flex-grow">
              {note.content || "No content available"}
            </p>
            <div className="flex justify-between items-end mt-2">
              <p className="text-gray-500 text-xs">
                {formatDate(note.updatedAt || note.createdAt)}
              </p>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleEdit}
                  className="bg-[#43CBFF] hover:bg-[#38b6ff] text-white p-2 rounded-lg flex items-center justify-center transition-colors"
                  title="Edit Note"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center justify-center transition-colors"
                  title="Delete Note"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;