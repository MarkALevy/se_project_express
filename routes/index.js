const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');
const {
  validateUserBody,
  validateUserLogin,
} = require('../middlewares/validation');

router.use('/users', userRouter);
router.use('/items', itemRouter);
router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserBody, createUser);

module.exports = router;
