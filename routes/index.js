const router = require('express').Router();
const userRouter = require('./users');
const itemRouter = require('./clothingItems');
const { login, createUser } = require('../controllers/users');

router.use('/users', userRouter);
router.use('/items', itemRouter);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
