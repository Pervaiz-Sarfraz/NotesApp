import { create } from "zustand";
import { loginurl, registerurl,NotesList,createNoteurl, changeurl } from "../utils";

export const useProductStore = create((set) => ({
  Notes: [],
  user: null,
  token: null,

  setUser: (user, token) => set({ user, token }),

  register: async (userData) => {
    const res = await fetch(registerurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.token) {
      set({ user: data.user, token: data.token });
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  login: async (credentials) => {
    const res = await fetch(loginurl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.token) {
      set({ user: data.user, token: data.token });
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("token");
  },
  fetchNotes: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Please login to view Notes." };
    }

    try {
      const res = await fetch(NotesList, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('data====',data);
      
      set({ Notes: data || [] });
    } catch (err) {
      console.log(`Error fetching Notes: ${err}`);
    }
  },

  addNote: async (newNote) => {

    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Please login to create a product." };
    }
    const res = await fetch(createNoteurl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body:newNote,
    });

    const data = await res.json();
    if (data.success) {
      set((state) => ({ notes: [...state.Notes, data.note] }));
    }
    return data;
  },

  deleteNote: async (noteId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Please login to delete a note." };
    }

    const res = await fetch(`${changeurl}/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      set((state) => ({
        notes: state.Notes.filter((note) => note._id !== noteId),
      }));
    }

    return data;
  },

  // updateNote: async (noteId, updatedNote) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     return { success: false, message: "Please login to update a note." };
  //   }

  //   const res = await fetch(`${changeurl}/${noteId}`, {
  //     method: "PUT",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(updatedNote),
  //   });

  //   const data = await res.json();
  //   if (data.success) {
  //     set((state) => ({
  //       notes: state.Notes.map((note) =>
  //         note._id === noteId ? data.note : note
  //       ),
  //     }));
  //   }

  //   return data;
  // },

  updateNote: async (id, data, isFormData = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "Please login to update a note." };
    }
  
    const res = await fetch(`${changeurl}/${id}`, {
      method: "PUT",
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
      },
      body: isFormData ? data : JSON.stringify(data),
    });
  
    const responseData = await res.json();
    if (responseData.success) {
      set((state) => ({
        notes: state.Notes.map((note) =>
          note._id === id ? data.note : note
        ),
      }));
      return responseData;
    }
  }
  
}));