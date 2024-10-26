const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { validateUserProfile } = require('../middlewares/validation');

const { getCurrentUser, updateUser } = require('../controllers/users');

router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, validateUserProfile, updateUser);

module.exports = router;
