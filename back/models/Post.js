import mongoose, { model, Schema } from 'mongoose';
import { Comment as CommentSchema } from './Comments.js';

const Post = new Schema(
  {
    title: { type: String, required: true, unique: true },
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: { type: Array, default: [] },
    viewsCount: { type: Number, default: 0 },
    imageUrl: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

export const PostModel = model('Post', Post);
