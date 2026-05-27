const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Humne yahan new mongoose.Schema kiya hai
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// Set up pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});

// Login ke liye password verification method
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Humne yahan mongoose.model use kiya hai aur end me 'exports' theek kiya hai
const User = mongoose.model("User", userSchema);

module.exports = User;