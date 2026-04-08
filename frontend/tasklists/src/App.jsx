import { useState } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import AuthModal from "./components/AuthModal"
import LandingPage from "./page/LandingPage"
import CreateTodo from "./page/CreateTodo"
import Lists from "./page/Lists"
import UserProfile from "./page/UserProfile"
import NotFound from "./components/NotFound"
import GenAi from "./page/GenAi"
import UpdateProfile from "./page/UpdateProfile"

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAuth={() => setAuthModalOpen(true)} />
      <main className="flex-1">
        <Routes>
          <Route
            index
            element={<LandingPage onOpenAuth={() => setAuthModalOpen(true)} />}
          />
          <Route path="/create" element={<CreateTodo />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/genai" element={<GenAi />} />
          <Route path="/user-profile/:uid" element={<UserProfile />} />
          <Route path="/update-profile/:uid" element={<UpdateProfile />} />
          {/* Redirect old auth routes to home with modal */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  )
}

export default App
