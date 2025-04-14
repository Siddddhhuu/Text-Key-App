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
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Key Store App</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <NoteForm onNoteAdded={handleNoteAdded} />
      <NoteList key={refreshKey} onNoteAdded={handleNoteAdded} />
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Key Store App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default NotesPage;
