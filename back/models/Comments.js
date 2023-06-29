import mongoose, { model, Schema } from 'mongoose';

export const Comment = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    postId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const CommentModel = model('Comment', Comment);
