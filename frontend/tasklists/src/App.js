import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import CreateTodo from "./page/CreateTodo";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import Lists from "./page/Lists";
import UserProfile from "./page/UserProfile";
import NotFound from "./components/NotFound";
import GenAi from "./page/GenAi";
import UpdateProfile from "./page/UpdateProfile";

function App() {
  return (
    <main className="app">
      <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/create" element={<CreateTodo />} />
          <Route path="/register" element={<Signup/> } />
          <Route path="/login" element={<SignIn/> } />
          <Route path="/lists" element={<Lists /> } />
          <Route path="/genai" element={<GenAi /> } />
          <Route path='/user-profile/:uid' element={<UserProfile /> } />
          <Route path='/update-profile/:uid' element={<UpdateProfile /> } />
          <Route path='/*' element={<NotFound /> } />
        </Routes>
    </main>
  );
}

export default App;
