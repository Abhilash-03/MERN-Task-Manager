import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { 
  Trash2, 
  LogOut, 
  AlertCircle, 
  Mail, 
  User, 
  Calendar, 
  Edit3, 
  Shield, 
  CheckCircle2,
  ListTodo,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { logoutSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { WarningModal } from "@/components/Modal"
import SideBar from "@/components/Sidebar"

const UserProfile = () => {
  const [openModal, setOpenModal] = useState(false)
  const { currentUser, error } = useSelector((state) => state.user)
  const { lists } = useSelector((state) => state.todo)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  if (!currentUser) {
    return null
  }

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout")
      dispatch(logoutSuccess())
      navigate("/")
    } catch (error) {
      console.log(error.response?.data?.msg)
    }
  }

  const completedTasks = lists?.filter(todo => todo.status === 'completed')?.length || 0
  const totalTasks = lists?.length || 0
  
  // Check multiple possible field names for account creation date
  const createdDate = currentUser?.createdAt || currentUser?.created_at || currentUser?.joinedAt
  const memberSince = createdDate
    ? new Date(createdDate).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      <SideBar />

      <div className="flex-1">
        {error && (
          <div className="m-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Profile Hero Section */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-56 bg-gradient-to-br from-primary via-primary/80 to-primary/60 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* Profile Info Overlay */}
          <div className="container px-6 md:px-8">
            <div className="relative -mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6">
              {/* Avatar & Name */}
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6">
                <Avatar className="h-32 w-32 md:h-36 md:w-36 border-4 border-background shadow-2xl ring-4 ring-primary/20">
                  <AvatarImage src={currentUser?.profilePicture} alt={currentUser?.username} />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left pb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{currentUser?.username}</h1>
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <Link to={`/update-profile/${currentUser._id}?tab=update`}>
                <Button variant="outline" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container px-6 md:px-8 py-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stats Cards */}
            <div className="lg:col-span-3 grid gap-4 sm:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                      <p className="text-3xl font-bold mt-1">{totalTasks}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ListTodo className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold mt-1">{completedTasks}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-xl font-bold mt-1">{memberSince}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>Your personal account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-semibold truncate">@{currentUser?.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-semibold truncate">{currentUser?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-sm truncate">{currentUser?._id}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Separator />
                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setOpenModal(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal */}
        <WarningModal openModal={openModal} setOpenModal={setOpenModal} />
      </div>
    </div>
  )
}

export default UserProfile
