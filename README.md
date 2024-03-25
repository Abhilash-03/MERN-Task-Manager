# TodoList App

This is a Task Manager app that allows users to create, read, update delete, and add to favourite tasks. It is built on the MERN stack (MongoDB, Express, React and Node.js) and it has authorization and authentication features using JWT and bcrypt, for state management I used Redux Toolkit.

## Features

- Users can sign up and log in with their email and password.
- Users can create tasks with a title.
- Users can view their tasks in a list.
- Users can edit or delete their tasks.
- Users can mark their tasks as completed or incomplete.
- Users can log out from their account.
- Dark Mode, Add to favourite functionality.

## Project Preview Link
[Todolist_Project_Link](https://todolist-views.vercel.app/)

## Installation

To run this app locally, you need to have Node.js, npm and MongoDB installed on your machine. Then follow these steps:

- Clone this repository to your local machine.
- Navigate to the project folder and run `npm install` to install the dependencies.
- Create a `.env` file in the root folder and add the following variables:

  - `PORT`: The port number for the server (default is 5000).
  - `MONGO_URI`: The connection string for your MongoDB database.
  - `JWT_SECRET`: The secret key for generating JWT tokens.

- Run `npm run dev` to start the server and Run `npm run start` to start the react app.
- Open your browser and go to `http://localhost:3000` to see the app in action.
