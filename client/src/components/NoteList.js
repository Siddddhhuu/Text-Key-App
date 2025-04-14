import { useState, useEffect } from 'react';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';

function NoteList({ onNoteUpdated }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [actionType, setActionType] = useState(''); // 'edit' or 'delete'

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/notes/',
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${id}`,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );
      fetchNotes();
      onNoteUpdated?.();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleUpdate = async (updatedNote) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notes/${editingNote._id}`,
        updatedNote,
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      setEditingNote(null);
      fetchNotes();
      onNoteUpdated?.();
    } catch (error) {
      console.error('Error updating note:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) return <div className="p-6">Loading notes...</div>;

  return (
    <div className="p-6">
      {editingNote && !showKeyPrompt && (
        <EditNoteModal 
          note={editingNote}
          onSave={(updatedNote) => handleUpdate(updatedNote)}
          onClose={() => setEditingNote(null)}
        />
      )}
      {showKeyPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              {actionType === 'delete' ? 'Enter Key to Delete Note' : 'Enter Key to Edit Note'}
            </h3>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter note key"
              className="w-full p-2 border rounded mb-2"
            />
            {keyError && <p className="text-red-500 text-sm mb-2">{keyError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowKeyPrompt(false);
                  setEditingNote(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                  onClick={() => {
                    if (keyInput === editingNote.key) {
                      setShowKeyPrompt(false);
                      if (actionType === 'delete') {
                        handleDelete(editingNote._id);
                      }
                    } else {
                      setKeyError('Incorrect key');
                    }
                  }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. Add your first note above!</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold">{note.title}</h3>
                  <p className="mt-2">{note.content}</p>
                  {note.key && (
                    <p className="mt-1 text-sm text-gray-500">
                      Key: {note.key.substring(0, 0)}*****
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      if (note.key) {
                        setShowKeyPrompt(true);
                        setEditingNote(note);
                        setKeyInput('');
                        setKeyError('');
                        setActionType('edit');
                      } else {
                        setEditingNote(note);
                      }
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => {
                      if (note.key) {
                        setShowKeyPrompt(true);
                        setEditingNote(note);
                        setKeyInput('');
                        setKeyError('');
                        setActionType('delete');
                      } else {
                        handleDelete(note._id);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NoteList;
