const User = require('../models/user');
const {
  INVALID_DATA_PASSED_CODE,
  NON_EXISTING_ADDRESS_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/errors');

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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_PASSED_CODE)
          .send({ message: 'Invalid data' });
      }
      return res
        .status(DEFAULT_ERROR_CODE)
        .send({ message: 'An error has occurred on the server' });
    });
};

module.exports = { getUser, getUsers, createUser };
