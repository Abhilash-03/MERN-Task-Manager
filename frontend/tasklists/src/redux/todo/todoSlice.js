import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lists: [],
    error: null,
    filteredTodo: [],
}

export const todoSlice = createSlice({
   name: 'todo',
   initialState,
   reducers: {
     addTodo: (state, action) => {
        state.lists.push(action.payload);
     },
     addTodoFailure: (state, action) =>{
        state.error = action.payload;
     },
     deleteTodo: (state) => {
      state.error = null;
     },
     deleteTodoFailure: (state, action) => {
        state.error = action.payload;
     },
     getTodos: (state, action) => {
      state.lists = [...action.payload];
     },
     getTodoFailure: (state, action) => {
      state.error = action.payload
     },
     updateTodoFailure: (state, action) => {
      state.error = action.payload
     },
     addFavouriteFailure: (state, action) => {
      state.error = action.payload
     },
     filterTodo: (state, action) => {
      const filterTodoItem = state.lists.filter(item => {
         if(action.payload.type === 'completed') {
            return item.status === 'completed';
         } else if(action.payload.type === 'favourite') {
            return item.favourite;
         } else if(action.payload.type === 'pending') {
            return item.status === 'pending'
         } else if(action.payload.type === 'in-working') {
            return item.status === 'in-working'
         } 
         return item
      });
      state.filteredTodo = filterTodoItem;
     }
    
   }
})

export const { addTodo, addTodoFailure, deleteTodo,deleteTodoFailure,  getTodos, getTodoFailure, updateTodoFailure,  addFavouriteFailure, filterTodo } = todoSlice.actions;

export default todoSlice.reducer;