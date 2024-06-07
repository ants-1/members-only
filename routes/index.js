const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', messageController.index);

router.get('/sign-up', authController.sign_up_get);

router.post('/sign-up', authController.sign_up_post);

router.get('/log-in', authController.log_in_get);

router.post('/log-in', authController.log_in_post);

router.get('/log-out', authController.log_out_get);

router.get('/join-club', messageController.join_club_get);

router.post('/join-club', messageController.join_club_post);

router.get('/create-message', messageController.create_message_get); 

router.post('/create-message', messageController.create_message_post);

router.post('/edit', messageController.edit_message);

router.post('/delete', messageController.delete_message);

module.exports = router;
