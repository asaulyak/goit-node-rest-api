import { Schema, model } from 'mongoose';

const contact = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4
    },
    phone: {
      type: String,
      required: true,
      minlength: 4
    },
    favorite: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false, timestamps: true }
);

export const Contact = model('contacts', contact);
