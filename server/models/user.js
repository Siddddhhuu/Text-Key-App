const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

// Validating the encryption key on startup
if (!process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_KEY.length < 32) {
  throw new Error('ENCRYPTION_KEY must be at least 32 characters in .env file');
}

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  encryptedEmail: {
    type: String,
    required: true,
    unique: true,
    set: (value) => {
      return CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString();
    }
  },
  password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Email decryption method
userSchema.methods.decryptEmail = function() {
  const bytes = CryptoJS.AES.decrypt(this.email, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model('User', userSchema);
