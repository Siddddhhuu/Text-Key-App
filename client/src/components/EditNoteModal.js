import { useState } from 'react';

function EditNoteModal({ note, onSave, onClose }) {
  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
    // Track if key was changed
    keyChanged: false,
    keyValue: ''
  });

  const handleSave = () => {
    const updatedNote = {
      title: form.title,
      content: form.content
    };
    
    // Only include key if it was changed
    if (form.keyChanged && form.keyValue) {
      updatedNote.key = form.keyValue;
    }

    onSave(updatedNote);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({...form, content: e.target.value})}
            className="w-full p-2 border rounded"
            rows="4"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Encryption Key
            </label>
            <input
              type="password"
              placeholder="Enter new key to change encryption"
              value={form.keyValue}
              onChange={(e) => setForm({
                ...form,
                keyValue: e.target.value,
                keyChanged: true
              })}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to keep current encryption
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditNoteModal;