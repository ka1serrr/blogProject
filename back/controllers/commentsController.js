import { PostModel } from '../models/Post.js';
import { CommentModel } from '../models/Comments.js';
import errors from '../mistakesText.js';
import { ObjectId } from 'mongodb';

class CommentsController {
  async postComment(req, res) {
    try {
      const { postId, text } = req.body;
      const userId = req.userId;
      const _postId = new ObjectId(postId);

      const comment = await new CommentModel({
        text,
        postId,
        user: userId,
      });
      await comment.save();

      PostModel.findByIdAndUpdate(
        { _id: _postId },
        { $push: { comments: comment._id } },
        {
          returnDocument: 'after',
        },
      )
        .populate({ path: 'comments', populate: { path: 'user', model: 'User' } })
        .populate('user')
        .then((doc) => {
          res.status(200).json(comment);
        })
        .exec();
    } catch (e) {
      console.log(e.message);
    }
  }

  async deleteComment(req, res) {
    try {
      const commentId = req.params.id;

      await CommentModel.findOneAndRemove({
        _id: commentId,
      }).then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: errors.commentDidNotFound });
        }

        res.status(200).json({ message: 'Комментарий успешно удален' });
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }
  async getComments(req, res) {
    try {
      const comments = await CommentModel.find().limit(2).populate('user').exec();
      return res.status(200).json({ comments });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }
}

export const commentsController = new CommentsController();
