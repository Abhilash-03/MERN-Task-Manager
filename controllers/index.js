
const { BadRequest } = require('../errors');
const Todo = require('../models/todoModel');

const getAllTodo = async(req, res)=>{
    const getTodo = await Todo.find({createdBy: req.user.userId});
    res.status(200).json({getTodo, todoCount: getTodo.length});
}

const getTodo = async(req, res) => {
    const {params: {id}, user: {userId}} = req;

    const todo = await Todo.findOne({_id: id, createdBy: userId});
    if(!todo){
        throw new BadRequest('Todo not found!');
    }

    res.status(200).json({ todo });
}

const createTodo = async(req, res)=>{
    const {name} = req.body;
    if(!name){
        throw new BadRequest('Name must be provided');
    }

    req.body.createdBy = req.user.userId;
  
    const todoList =  await Todo.create(req.body);
    res.status(201).json({todoList, msg: 'Todo Created Successfully!!'});
}

const updateTodo = async(req, res)=>{
    const {body: {name}, user: {userId}, params: {id: todoID}} = req;

    if(!name){
        throw new BadRequest('Name must be provided');
    }

    // Search for a task which matches the taskId and userId and then update it.
    const updateData = await Todo.findOneAndUpdate({_id: todoID, createdBy: userId}, req.body, 
        { 
            new:true,
            runValidators:true
    });

     if(!updateData){
        return res.status(400).json({msg: `Todo not found`})
     }

    res.status(200).json({updateData, msg: 'Todo Updated Successfully!!'});
}

const deleteTodo = async(req, res)=>{
    const {params: {id: todoID}, user: {userId}} = req;
   
    // Search for a task which matches the taskId and userId and then delete it.
        const delTodo = await Todo.findOneAndDelete({_id: todoID, createdBy: userId});
        if(!delTodo){
            return res.status(400).json({msg: `Todo not found`});
        }

        res.status(200).json({delTodo, msg: 'Todo Deleted Successfully!!'});

}

const favouriteTodo = async(req, res) => {
    const {params: {id: todoID}, user: {userId}} = req;

    const favourite = await Todo.findOneAndUpdate({_id: todoID, createdBy: userId}, {
        $set: {
            favourite: req.body.favourite
        }
    }, {
        new: true,
        runValidators: true
    });
    if(!favourite) {
        return res.status(400).json({msg: `Todo not found`});
    }

    res.status(200).json({ favourite, msg: 'Added as a favourite' });


}

module.exports = {
    getAllTodo,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    favouriteTodo
}