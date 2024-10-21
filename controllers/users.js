const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  INVALID_DATA_PASSED_CODE,
  NON_EXISTING_ADDRESS_CODE,
  DEFAULT_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  AUTHENTICATION_ERROR_CODE,
} = require('../utils/errors');
const { JWT_SECRET } = require('../utils/config');

const createUser = (req, res) => {
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
      console.error(err);
      if (err.message === 'A user with this email already exists') {
        res.status(CONFLICT_ERROR_CODE).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(INVALID_DATA_PASSED_CODE).send({ message: 'Invalid data' });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(INVALID_DATA_PASSED_CODE)
      .send({ message: 'The password and email fields are required' });
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
        res.status(AUTHENTICATION_ERROR_CODE).send({ message: err.message });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NON_EXISTING_ADDRESS_CODE)
          .send({ message: 'Requested resource not found' });
      }
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_PASSED_CODE)
          .send({ message: 'Invalid data' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'An error has occurred on the server' });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res
          .status(NON_EXISTING_ADDRESS_CODE)
          .send({ message: 'User not found' });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INVALID_DATA_PASSED_CODE).send({ message: 'Invalid data' });
      } else {
        res
          .status(DEFAULT_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
