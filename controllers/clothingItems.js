const Item = require('../models/clothingItem');

// const errorHandler = require('../middlewares/error-handler');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ForbiddenError = require('../utils/errors/ForbiddenError');

const getItems = (req, res, next) => {
  Item.find({})
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      return next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Invalid data'));
      } else {
        return next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findOne({ _id: itemId })
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Invalid permissions to delete item'));
      } else {
        return Item.deleteOne({ _id: itemId })
          .orFail()
          .then(() => res.status(200).send({ data: item }))
          .catch((err) => {
            return next(err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Requested resource not found'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data'));
      } else {
        return next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Requested resource not found'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data'));
      } else {
        return next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Requested resource not found'));
      } else if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid data'));
      } else {
        return next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
