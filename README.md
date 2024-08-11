# TodoList App

This is a Task Manager app that allows users to create, read, update delete, and add to favourite tasks. It is built on the MERN stack (MongoDB, Express, React and Node.js) and it has authorization and authentication features using JWT and bcrypt, for state management I used Redux Toolkit.

## --UPDATED V-2.0--

1. Added `Google Authentication (OAUTH)` Feature using Firebase.
2. `Changed UI` in Create, Lists, Sign-in/Sign-up Page.
3. `Added User Profile Page` (It is having user profile image, Username, Email-id and UID).
4. Added `User Delete Account` Functionality.
5. Added `GENAI` Page, it's a `AI feature` where you can ask your problems, ideas, solution and etc. to `AI` built on Gemini.
6. Added `NOTES` option field in Create Page, where you can write your notes along with your task.
7. Added `STATUS (pending, in-working, completed)` option in todo-task.
8. Added `Show/Hide` Password Feature in Sign-in/Sign-up Password Field. 
9. `Updated` Home page in dark mode.
10. `Add GenAI button` on Home and Create Page.
11. `Added Update User Profile feature` (update user profile image, username, email and password).
12.  ### `Continue......`

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
