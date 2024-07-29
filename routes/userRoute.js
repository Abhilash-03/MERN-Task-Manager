const express = require('express');
const { deleteAccount } = require('../controllers/user');
const router = express.Router();

router.delete("/deleteAccount/:uid", deleteAccount);


module.exports = router;