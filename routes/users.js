const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  getCurrentUser,
} = require('../controllers/users');

// router.get('/', getUsers);
// router.get('/:userId', getUser);
// router.post('/', createUser);
router.get('/me', getCurrentUser);

module.exports = router;
