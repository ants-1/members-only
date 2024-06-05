const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', authController.index);

router.get('/sign-up', authController.sign_up_get);

router.post('/sign-up', authController.sign_up_post);

router.get('/log-in', authController.log_in_get);

router.post('/log-in', authController.log_in_post);

router.get('/log-out', authController.log_out_get);

module.exports = router;
