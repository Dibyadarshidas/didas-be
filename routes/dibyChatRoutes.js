const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/dibyChatController');

// Chat endpoint
router.post('/chat', handleChat);

module.exports = router; 