const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserByEmail } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getuser',getUserByEmail)

module.exports = router;
