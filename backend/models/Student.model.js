import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    rodCislo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    leasedBook: [
      {
        _id: false,
        idLibrary: {
          type: String,
          required: true,
        },
        ISBN: {
          type: String,
          required: true,
        },
        leasDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    history: [
      {
        _id: false,
        idLibrary: {
          type: String,
          required: true,
        },
        ISBN: {
          type: String,
          required: true,
        },
        leasDate: {
          type: Date,
          required: true,
        },
        returnDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { versionKey: false }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
