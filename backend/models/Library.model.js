import mongoose from "mongoose";
const uniqueArrayPlugin = require("mongoose-unique-array");
const Schema = mongoose.Schema;

const librarySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    regStudents: [
      {
        type: String,
      },
    ],
    books: [
      {
        _id: false,
        ISBN: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        autor: {
          type: String,
          required: true,
        },
        leased: {
          type: String,
          default: "false",
        },
      },
    ],
  },
  { versionKey: false }
);

const Library = mongoose.model("Library", librarySchema);
export default Library;
