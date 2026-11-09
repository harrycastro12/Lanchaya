const router = require('express').Router();
const c = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth');

router.post('/auth/login', c.login);
router.get('/auth/me', requireAuth, c.me);

module.exports = router;
