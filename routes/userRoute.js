const express = require('express');
const { deleteAccount, updateUserProfile } = require('../controllers/user');
const router = express.Router();

router.delete("/deleteAccount/:uid", deleteAccount);
router.patch("/update-profile/:uid", updateUserProfile);


module.exports = router;