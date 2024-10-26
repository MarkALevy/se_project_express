const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const errorHandler = require('../middlewares/error-handler');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const ConflictError = require('../utils/errors/ConflictError');
const { JWT_SECRET } = require('../utils/config');

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (user) {
        return Promise.reject(
          new Error('A user with this email already exists')
        );
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '1h',
      });

      res.status(201).send({
        token,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.message === 'A user with this email already exists') {
        next(new ConflictError(err.message));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new BadRequestError('The password and email fields are required')
    );
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({
        token,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        next(new UnauthorizedError(err.message));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Requested resource not found'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(new NotFoundError('User not found'));
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
