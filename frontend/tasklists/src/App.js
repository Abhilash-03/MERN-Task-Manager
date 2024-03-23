import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./page/Home";
import CreateTodo from "./page/CreateTodo";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn";
import Lists from "./page/Lists";

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
        </Routes>
    </main>
  );
}

export default App;
