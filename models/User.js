const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    success: {
      type: String,
      required: false,
    },
    accessToken: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
      required: false,
    },
    item: {
      password: {
        type: String,
        required: true,
      },
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      birthday: {
        type: Date,
        required: true,
      },
      createdBy: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
