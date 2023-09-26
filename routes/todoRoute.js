const express = require('express');
const { getAllTodo, createTodo, updateTodo, deleteTodo } = require('../controllers');
const router = express.Router();

router.route('/').get(getAllTodo).post(createTodo);

router.route('/:id').patch(updateTodo).delete(deleteTodo);

module.exports = router