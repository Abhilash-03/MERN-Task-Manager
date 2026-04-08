import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "@/firebase"
import api from "@/axios/axios"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  loginFailure,
  loginSuccess,
  signupSuccess,
  singupFailure,
  start,
} from "@/redux/user/userSlice"
import { cn } from "@/lib/utils"

const AuthModal = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error, loading } = useSelector((state) => state.user)
  const auth = getAuth(app)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    dispatch(start())
    try {
      const response = await api.post("/api/v1/auth/login", formData)
      if (response.status === 200) {
        dispatch(loginSuccess(response?.data))
        setSuccessMessage(`Welcome back, ${response?.data?.username}!`)
        setTimeout(() => {
          onOpenChange(false)
          navigate("/lists")
        }, 1500)
      } else {
        dispatch(loginFailure(response?.data.msg))
      }
    } catch (error) {
      dispatch(loginFailure(error.response?.data?.msg || "Login failed"))
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    dispatch(start())
    try {
      const response = await api.post("/api/v1/auth/register", formData)
      dispatch(signupSuccess())
      setSuccessMessage(`Account created! Welcome, ${response?.data?.username}!`)
      setTimeout(() => {
        setActiveTab("signin")
        setSuccessMessage("")
      }, 2000)
    } catch (error) {
      const errormsg = error.response?.data?.msg
      if (errormsg?.code === 11000) {
        const errmsg = Object.values(errormsg.keyValue)[0]
        dispatch(singupFailure(errmsg))
      } else {
        dispatch(singupFailure(error.response?.data?.msg || "Registration failed"))
      }
    }
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: "select_account" })
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)
      const newUser = {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      }
      const res = await api.post("/api/v1/auth/googleAuth", newUser)
      if (res.status === 200) {
        dispatch(loginSuccess(res?.data))
        setSuccessMessage(`Welcome, ${res?.data?.username}!`)
        setTimeout(() => {
          onOpenChange(false)
          navigate("/lists")
        }, 1500)
      } else {
        dispatch(loginFailure(res?.data.msg))
      }
    } catch (error) {
      console.log("Error occurred: ", error.message)
      dispatch(loginFailure(error.message))
    }
  }

  // Clear errors when switching tabs
  const handleTabChange = (value) => {
    setActiveTab(value)
    dispatch(loginFailure(""))
    dispatch(singupFailure(""))
    setSuccessMessage("")
    setFormData({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "signin"
              ? "Sign in to access your tasks and stay productive"
              : "Join Task Manager and start managing your tasks efficiently"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-center text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Sign In Tab */}
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    className="pl-9"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-9"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* OAuth Section */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={handleGoogleAuth}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
