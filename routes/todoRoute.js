const express = require('express');
const { getAllTodo, createTodo, updateTodo, deleteTodo, getTodo, favouriteTodo } = require('../controllers');
const router = express.Router();

router.route('/').get(getAllTodo).post(createTodo);

router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo)
router.route('/favourite/:id').patch(favouriteTodo);

module.exports = router