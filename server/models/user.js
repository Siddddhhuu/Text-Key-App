const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    set: (value) => CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString()
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    set: (value) => CryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString()
  },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Add decryption methods
userSchema.methods.decryptEmail = function() {
  return CryptoJS.AES.decrypt(this.email, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
};

userSchema.methods.decryptUsername = function() {
  return CryptoJS.AES.decrypt(this.username, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model('User', userSchema);
