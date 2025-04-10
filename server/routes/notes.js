const express = require('express');
const CryptoJS = require('crypto-js'); // For content encryption (needs two-way)
const Note = require('../models/note');
const auth = require('../middleware/auth');
const router = express.Router();

// Note: Using CryptoJS for content encryption since we need two-way encryption
// Passwords use bcrypt (one-way hashing) in the User model
const encrypt = (text) => {
  if (!text) return text;
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};
const decrypt = (ciphertext) => {
  if (!ciphertext) return ciphertext;
  return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
};

router.post('/', auth, async (req, res) => {
  const { title, content, key } = req.body;
  try {
    const encryptedContent = encrypt(content);
    const encryptedKey = key ? encrypt(key) : null;
    const note = new Note({
      userId: req.user.id,
      title,
      content: encryptedContent,
      key: encryptedKey,
    });
    await note.save();
    res.status(201).json({ message: 'Note saved' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    const decryptedNotes = notes.map(note => ({
      ...note._doc,
      content: decrypt(note.content),
      key: note.key ? decrypt(note.key) : null,
    }));
    res.json(decryptedNotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, content, key } = req.body;
  try {
    const encryptedContent = encrypt(content);
    const encryptedKey = key ? encrypt(key) : null;
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { 
        title,
        content: encryptedContent,
        key: encryptedKey,
        updatedAt: new Date() 
      },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note updated' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Attempting to delete note:', {
      id: req.params.id,
      user: req.user.id,
      time: new Date().toISOString()
    });

    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      console.log('Note not found in database');
      return res.status(404).json({ message: 'Note not found' });
    }

    console.log('Successfully deleted note:', {
      id: note._id,
      title: note.title
    });

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Delete error:', {
      error: error.message,
      stack: error.stack,
      time: new Date().toISOString()
    });
    res.status(400).json({ 
      message: error.message,
      details: 'Check server logs for more information'
    });
  }
});

module.exports = router;
