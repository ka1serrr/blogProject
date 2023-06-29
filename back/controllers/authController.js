import jwt from 'jsonwebtoken';
import secret from '../config.js';
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcryptjs';
import errors from '../mistakesText.js';
import { ObjectId } from 'mongodb';

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret._secret, { expiresIn: '30d' });
};

class AuthController {
  async registration(req, res) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: errors.validationError, errors: validationErrors });
      }

      const { email, password, name, avatar } = req.body;
      const isUserNotUnique = await UserModel.findOne({ email });

      if (isUserNotUnique) {
        return res.status(400).json({ message: errors.regError });
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new UserModel({ email, password: hashPassword, name, avatar });
      await user.save();

      const token = generateAccessToken(user._id);

      res.status(200).json({
        ...user._doc,
        token,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        console.log('Неверный логин или пароль');
        return res.status(400).json({ message: errors.loginError });
      }

      const isValidPassword = await bcrypt.compare(password, user._doc.password);
      if (!isValidPassword) {
        console.log('Неверный логин или пароль');
        return res.status(400).json({ message: errors.loginError });
      }

      const token = generateAccessToken(user._id);
      res.status(200).json({
        ...user._doc,
        token,
        message: 'Вы успешно вошли',
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: errors.findError });
      }

      const { ...userData } = user._doc;
      res.status(200).json({
        userData,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: errors.error500 });
    }
  }

  async getProfileUnLogged(req, res) {
    try {
      const profileId = req.params.id;
      const _id = new ObjectId(profileId);
      const profile = await UserModel.findById({ _id });

      if (!profile) {
        return res.status(404).json({ message: errors.findError });
      }

      res.status(200).json({ profile });
    } catch (e) {
      console.log(e.message);
      return res.status(500).json({ message: errors.error500 });
    }
  }
}

export const authController = new AuthController();
