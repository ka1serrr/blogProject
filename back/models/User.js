import { Schema, model } from 'mongoose';

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
  },
  { timestamps: true },
);

export const UserModel = model('User', User);
