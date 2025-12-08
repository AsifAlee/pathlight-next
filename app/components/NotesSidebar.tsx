"use client";

import { useState, useRef, useEffect } from "react";
import { Notebook, X, Send, Image as ImageIcon, FileText, Paperclip, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Note {
    _id: string; // Mongoose ID
    id?: string; // Fallback
    type: 'text' | 'image' | 'file';
    content?: string;
    fileUrl?: string; // Backend uses fileUrl
    url?: string; // Fallback for old local notes if any
    fileName?: string; // Backend uses fileName
    name?: string; // Fallback
    createdAt: string; // Date comes as string from JSON
}

interface NotesSidebarProps {
    show: boolean;
    onClose: () => void;
}

export default function NotesSidebar({ show, onClose }: NotesSidebarProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [noteInput, setNoteInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const fetchNotes = async () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return;
            const user = JSON.parse(userStr);
            const userId = user.email || user.id;

            const res = await fetch(`/api/notes?userId=${encodeURIComponent(userId)}`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data.notes);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        }
    };

    useEffect(() => {
        if (show) {
            fetchNotes();
        }
    }, [show]);

    const handleAddTextNote = async () => {
        if (!noteInput.trim()) return;

        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const userId = user.email || user.id;

        const formData = new FormData();
        formData.append("type", "text");
        formData.append("content", noteInput);
        formData.append("userId", userId);

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setNotes(prev => [...prev, data.note]);
                setNoteInput("");
            } else {
                toast.error("Failed to save note");
            }
        } catch (error) {
            toast.error("Error saving note");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 6 * 1024 * 1024) {
            toast.error("File size must be less than 6MB");
            e.target.value = '';
            return;
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const userId = user.email || user.id;

        const formData = new FormData();
        formData.append("type", "file");
        formData.append("file", file);
        formData.append("userId", userId);

        const toastId = toast.loading("Uploading file...");

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setNotes(prev => [...prev, data.note]);
                toast.success("File uploaded", { id: toastId });
            } else {
                toast.error("Failed to upload file", { id: toastId });
            }
        } catch (error) {
            toast.error("Error uploading file", { id: toastId });
        }
        e.target.value = ''; // Reset input
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 6 * 1024 * 1024) {
            toast.error("Image size must be less than 6MB");
            e.target.value = '';
            return;
        }

        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const userId = user.email || user.id;

        const formData = new FormData();
        formData.append("type", "image");
        formData.append("file", file);
        formData.append("userId", userId);

        const toastId = toast.loading("Uploading image...");

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setNotes(prev => [...prev, data.note]);
                toast.success("Image uploaded", { id: toastId });
            } else {
                toast.error("Failed to upload image", { id: toastId });
            }
        } catch (error) {
            toast.error("Error uploading image", { id: toastId });
        }
        e.target.value = ''; // Reset input
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            const res = await fetch(`/api/notes?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setNotes(prev => prev.filter(n => (n._id || n.id) !== id));
                toast.success("Note deleted");
            } else {
                toast.error("Failed to delete note");
            }
        } catch (error) {
            toast.error("Error deleting note");
        }
    };

    return (
        <div className={`fixed right-0 top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col w-80 sm:w-96 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Notebook size={20} className="text-orange-500" />
                    Session Notes
                </h3>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {notes.length === 0 ? (
                    <div className="text-center text-slate-400 mt-10">
                        <Notebook size={48} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No notes yet.</p>
                        <p className="text-xs">Take notes, upload images or files to keep track of your session.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <div key={note._id || note.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {note.type === 'text' && (
                                <p className="text-slate-700 text-sm whitespace-pre-wrap">{note.content}</p>
                            )}

                            {note.type === 'image' && (
                                <div className="space-y-2">
                                    <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                                        <img src={note.fileUrl || note.url} alt="Note attachment" className="w-full h-auto max-h-48 object-contain" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ImageIcon size={14} className="text-blue-500" />
                                        <span className="text-xs text-slate-500 truncate max-w-[200px]">{note.fileName || note.name}</span>
                                    </div>
                                </div>
                            )}

                            {note.type === 'file' && (
                                <a href={note.fileUrl || note.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-colors group">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                        <FileText size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate">{note.fileName || note.name}</p>
                                        <p className="text-xs text-orange-600">Click to open</p>
                                    </div>
                                </a>
                            )}

                            <div className="flex justify-between items-end mt-2">
                                <p className="text-[10px] text-slate-400">
                                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <button
                                    onClick={() => handleDeleteNote(note._id || note.id || '')}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete note"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2 mb-2">
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Upload Image"
                    >
                        <ImageIcon size={20} />
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Upload File"
                    >
                        <Paperclip size={20} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTextNote();
                            }
                        }}
                        placeholder="Type a note..."
                        className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 min-h-[44px] max-h-32"
                        rows={1}
                    />
                    <button
                        onClick={handleAddTextNote}
                        disabled={!noteInput.trim()}
                        className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors flex-shrink-0 self-end"
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Hidden Inputs */}
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
}
