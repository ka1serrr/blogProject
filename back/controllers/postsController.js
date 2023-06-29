import errors from '../mistakesText.js';
import { PostModel } from '../models/Post.js';

class PostsController {
  async createPost(req, res) {
    try {
      const { title, text, tags, imageUrl } = req.body;
      const post = await new PostModel({
        title,
        text,
        imageUrl,
        tags,
        user: req.userId,
      });
      await post.save();

      res.status(200).json(post);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async getPosts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const total = await PostModel.countDocuments();
      const posts = await PostModel.find().populate('user').skip(startIndex).limit(limit).exec();

      const result = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: posts,
      };

      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async getTags(req, res) {
    try {
      const posts = await PostModel.find().limit(5).exec();
      const tags = posts
        .map((item) => item.tags)
        .flat()
        .slice(0, 5);

      res.status(200).json(tags);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async getOnePost(req, res) {
    try {
      const postId = req.params.id;
      await PostModel.findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $inc: { viewsCount: 1 },
        },
        {
          returnDocument: 'after',
        },
      )
        .populate({ path: 'comments', populate: { path: 'user', model: 'User' } })
        .populate('user')
        .then((doc) => {
          if (!doc) {
            return res.status(404).json({ message: errors.notFoundPostError });
          }

          res.status(200).json(doc);
        });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }
  async deletePost(req, res) {
    try {
      const postId = req.params.id;

      await PostModel.findOneAndDelete({
        _id: postId,
      })
        .then((doc) => {
          if (!doc) {
            return res.status(404).json({ message: errors.notFoundPostError });
          }

          res.status(200).json({ message: 'Статья успешно удалена' });
        })
        .catch((e) => {
          console.log(e.message);

          res.status(500).json({ message: errors.error500 });
        });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async updatePost(req, res) {
    try {
      const postId = req.params.id;
      const { title, text, imageUrl, tags } = req.body;

      await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          title,
          text,
          imageUrl,
          author: req.userId,
          tags,
        },
      );

      res.status(200).json({ message: 'Статья успешно обновлена' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }
}

export const postsController = new PostsController();
