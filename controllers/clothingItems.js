const Item = require('../models/clothingItem');
const {
  INVALID_DATA_PASSED_CODE,
  NON_EXISTING_ADDRESS_CODE,
  DEFAULT_ERROR_CODE,
} = require('../utils/errors');

const getItems = (req, res) => {
  Item.find({})
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res
          .status(INVALID_DATA_PASSED_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.deleteOne({ _id: itemId })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NON_EXISTING_ADDRESS_CODE)
          .send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res
          .status(INVALID_DATA_PASSED_CODE)
          .send({ message: err.message });
      }
      return res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NON_EXISTING_ADDRESS_CODE)
          .send({ message: err.message });
      }
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NON_EXISTING_ADDRESS_CODE)
          .send({ message: err.message });
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
