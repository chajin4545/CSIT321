const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chatController.sendMessage);
router.get('/history', protect, chatController.getChatHistory);
router.get('/session/:sessionId', protect, chatController.getSession);

module.exports = router;
