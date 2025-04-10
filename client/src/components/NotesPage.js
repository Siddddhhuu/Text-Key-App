import { useState,useEffect } from 'react';
import NoteList from './NoteList';
import NoteForm from './NoteForm';

function NotesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    console.log('NotesPage mounted');
    return () => console.log('NotesPage unmounted');
  }, []);

  const handleNoteAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end p-4">
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <NoteForm onNoteAdded={handleNoteAdded} />
      <NoteList key={refreshKey} onNoteAdded={handleNoteAdded} />
    </div>
  );
}

export default NotesPage;
