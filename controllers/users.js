const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {
  INVALID_DATA_PASSED_CODE,
  NON_EXISTING_ADDRESS_CODE,
  DEFAULT_ERROR_CODE,
  AUTHENTICATION_ERROR_CODE,
} = require('../utils/errors');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'An error has occurred on the server' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
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

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(
          new Error('A user with this email already exists')
        );
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.log(err.name);
      console.error(err);
      if (err.message === 'A user with this email already exists') {
        res.status(409).send({ message: err.message });
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

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(AUTHENTICATION_ERROR_CODE).send({ message: err.message });
    });
};

module.exports = { getUser, getUsers, createUser, login };
