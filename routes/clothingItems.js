const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const {
  validateItemBody,
  validateItemId,
} = require('../middlewares/validation');

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingItems');

router.get('/', getItems);
router.post('/', auth, validateItemBody, createItem);
router.delete('/:itemId', auth, validateItemId, deleteItem);
router.put('/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/:itemId/likes', auth, validateItemId, dislikeItem);

module.exports = router;
