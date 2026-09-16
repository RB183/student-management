const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    profileImage: {
      url: {
        type: String,
        // Kept your custom default Cloudinary avatar!
        default: "",
      },
      public_id: {
        type: String,
        default: null, // Null indicates it's using the default image
      },
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },

    passwordHash: {
      type: String,
      select: false,
    },

  },
  {
    timestamps: true,
  }
);



const Student = mongoose.model("Student", studentSchema);

module.exports = Student;