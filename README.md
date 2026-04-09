# TodoList App

This is a Task Manager app that allows users to create, read, update delete, and add to favourite tasks. It is built on the MERN stack (MongoDB, Express, React and Node.js) and it has authorization and authentication features using JWT and bcrypt, for state management I used Redux Toolkit.

## Project Preview Link
[🔗 Task Manager Project Link](https://todolist-views.vercel.app/)

## --UPDATED V-3 (Latest)--

 - Update the entire UI/UX of app
 - Migrate CRA (create-react-app) to Vite
 - Integrate some new AI features

### AI-Powered Features

1. **Enhanced GenAI Chat Interface:**
   - Modern chat-style UI with user/AI message bubbles
   - Markdown rendering support using ReactMarkdown
   - Animated loading indicators
   - Error alerts with clear messaging

2. **AI Task Generator:**
   - Generate task titles and notes from natural language prompts
   - Simply describe what you want to do, and AI creates the task

3. **Daily Motivational Quotes:**
   - Personalized motivational quotes on the Create Task page
   - Cached for 2 hours for optimal performance
   - Includes relevant emojis

4. **Smart Task Suggestions:**
   - AI analyzes your existing tasks and suggests related ones
   - Click to quickly add suggested tasks

5. **Task Breakdown Feature:**
   - Break down complex tasks into 3-5 smaller subtasks
   - Add subtasks individually to your task list

### Backend Improvements

6. **Multi-Model Fallback System:**
   - Automatic fallback between Gemini models (gemini-2.0-flash, gemini-2.5-flash-lite, gemini-1.5-flash)
   - Graceful rate limit handling with retry suggestions
   - Improved error messages

7. **New API Endpoints:**
   - `/api/v1/ai/genai` - General AI chat
   - `/api/v1/ai/generate-task` - AI task generation
   - `/api/v1/ai/motivation` - Daily motivation quotes
   - `/api/v1/ai/suggestions` - Smart task suggestions
   - `/api/v1/ai/breakdown` - Task breakdown into subtasks


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

## Features

- Users can sign up and log in with their email and password.
- Google Authentication (OAuth) via Firebase.
- Users can create tasks with a title and notes.
- Users can view their tasks in a list.
- Users can edit or delete their tasks.
- Users can mark their tasks as completed, in-progress, or pending.
- Users can log out from their account.
- Dark Mode, Add to favourite functionality.
- AI-powered task generation and suggestions.
- Task breakdown into subtasks using AI.
- Daily motivational quotes.
- User profile management with avatar upload.


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
