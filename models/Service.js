// models/Service.js

//const mongoose = require("mongoose");


import mongoose from 'mongoose' ;

const serviceSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    charges: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);