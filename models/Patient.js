// models/Patient.js

// const mongoose = require("mongoose");

import mongoose from 'mongoose' ;

const patientSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    petName: {
      type: String,
      required: true,
    },
    petType : {
      type: String,
      required: true,
    },
    lastVisit : {
      type: String,
      required: true,
    },

    notes : {
      type: String,
      required: true,
    },

    status : {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("Patient", patientSchema);
export default mongoose.model("Patient", patientSchema);