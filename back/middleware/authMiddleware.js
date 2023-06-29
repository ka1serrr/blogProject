import jwt from 'jsonwebtoken';
import error from '../mistakesText.js';
import config from '../config.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if (!token) {
      return res.status(403).json({ message: error.errorRules });
    }

    const decodedData = jwt.verify(token, config._secret);
    req.userId = decodedData.id;
    next();
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: error.error500 });
  }
};
