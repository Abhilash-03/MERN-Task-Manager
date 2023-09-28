
const { BadRequest } = require('../errors');
const Todo = require('../models/todoModel');

const getAllTodo = async(req, res)=>{
    const getTodo = await Todo.find({});
    res.status(200).json({getTodo, todoCount: getTodo.length});
}

const getTodo = async(req, res) => {
    const {id} = req.params;
    const todo = await Todo.findOne({_id: id});
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
  
        const todoList =  await Todo.create(req.body);
        res.status(201).json({todoList, msg: 'Item Created Successfully!!'});
}

const updateTodo = async(req, res)=>{
    const {name} = req.body;
    const {id: todoID} = req.params

    if(!name){
        throw new BadRequest('Name must be provided');
    }

    const updateData = await Todo.findByIdAndUpdate({_id: todoID}, req.body, 
        { 
            new:true,
            newValidators:true
    });

     if(!updateData){
        return res.status(400).json({msg: `No Data found with id: ${todoID}`})
     }

    res.status(200).json({updateData, msg: 'Item Updated Successfully!!'});
}

const deleteTodo = async(req, res)=>{
    const {id: todoID} = req.params;
  
        const delTodo = await Todo.findByIdAndDelete({_id: todoID});
        if(!delTodo){
            return res.status(400).json({msg: `No Data found with id: ${todoID}`});
        }
        res.status(200).json({delTodo, msg: 'Item Deleted Successfully!!'});

}

module.exports = {
    getAllTodo,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}