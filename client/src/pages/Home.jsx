import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { MdClose } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import NoteItem from "../comp/NoteItem";
import { useProductStore } from "../store/store";
// import { toast } from "react-toastify";

const Home = () => {
  const { Notes, fetchNotes } = useProductStore();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleLogout = async() => {
    localStorage.clear();
    location.reload();
  };

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    setFilteredNotes(
      Notes.filter((note) =>
        note?.title?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [Notes, searchText]);

  return (
    <section className="min-h-screen w-full bg-[#121212] flex flex-col items-center p-4 gap-6">
      {/* Header with Title and Logout */}
      <header className="w-full max-w-6xl bg-[#1e1c1c] border border-[#2c2c2c] h-[60px] flex justify-between items-center px-4 rounded-xl">
        <h2 className="text-white text-2xl font-bold">My Notes</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
          aria-label="Logout"
        >
          <FiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Search Bar - Now always visible */}
      <div className="w-full max-w-6xl bg-[#1e1c1c] border border-[#2c2c2c] h-[60px] flex items-center px-4 rounded-xl">
        <div className="flex items-center w-full">
          <CiSearch size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search notes by title..."
            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-400 text-base"
            onClick={(e) => e.stopPropagation()} // Prevent any unwanted behavior
          />
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="text-gray-400 hover:text-white"
            >
              <MdClose size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 text-lg">
            {searchText ? "No matching notes found" : "No notes available"}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {filteredNotes.map((note) => (
            <NoteItem key={note._id} note={note} />
          ))}
        </div>
      )}

      {/* Add Note Button */}
      <Link
        to="/create"
        className="fixed bottom-6 right-6 bg-gradient-to-br from-[#43CBFF] to-[#9708CC] text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
      >
        <BsPlusLg className="font-bold" />
        <span className="font-medium">Add Note</span>
      </Link>
    </section>
  );
};

export default Home;