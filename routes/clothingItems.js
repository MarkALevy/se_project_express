const router = require('express').Router();
const {
  getItem,
  createItem,
  deleteItem,
} = require('../controllers/clothingItems');

router.get('/', (req, res) => {
  console.log('GET clothing items');
});

router.post('/', (req, res) => {
  console.log('Create a new item');
});
router.delete('/:itemId', (req, res) => {
  console.log('deletes an item by ID');
});

module.exports = router;
