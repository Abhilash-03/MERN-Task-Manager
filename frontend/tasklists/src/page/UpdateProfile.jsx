import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { User, Mail, Lock, Eye, EyeOff, Save, Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { app } from "@/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateFailure, updateStart, updateSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import SideBar from "@/components/Sidebar"

const UpdateProfile = () => {
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [updateUser, setUpdateUser] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const { currentUser, loading } = useSelector((state) => state.user)
  const { uid } = useParams()
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (!currentUser) {
    navigate("/")
    return null
  }

  const handleImageFile = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    const storage = getStorage(app)
    const filename = new Date().getTime() + imageFile.name
    const storageRef = ref(storage, filename)
    const uploadTask = uploadBytesResumable(storageRef, imageFile)

    setImageFileUploading(true)
    setUploadError(null)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgress(progress.toFixed(0))
      },
      (error) => {
        setUploadError("Image could not upload (Image must be less than 5 MB)")
        setImageUploadProgress(null)
        setImageUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageUrl(downloadUrl)
          setUpdateUser({ ...updateUser, profilePicture: downloadUrl })
          setImageUploadProgress(null)
          setImageFileUploading(false)
        })
      }
    )
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage()
    }
  }, [imageFile])

  const handleOnChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.id]: e.target.value })
  }

  const handleUpdateUser = async () => {
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if (Object.keys(updateUser).length === 0) {
      setUpdateUserError("No changes made.")
      return
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload")
      return
    }

    try {
      dispatch(updateStart())
      const { data } = await api.patch(`api/v1/user/update-profile/${uid}`, updateUser)
      dispatch(updateSuccess(data))
      setUpdateUserSuccess("Profile updated successfully!")
    } catch (error) {
      dispatch(updateFailure(error?.response?.data?.msg))
      setUpdateUserError(error.response?.data?.msg)
    }
  }

  setTimeout(() => {
    setUpdateUserSuccess(null)
    setUpdateUserError(null)
  }, 6200)

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      <SideBar />

      <div className="flex-1 p-6">
        {/* Alerts */}
        {uploadError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{uploadError}</p>
          </div>
        )}

        {updateUserSuccess && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">{updateUserSuccess}</p>
          </div>
        )}

        {updateUserError && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{updateUserError}</p>
          </div>
        )}

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>Make changes to your profile here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar
                  className="h-24 w-24 cursor-pointer border-4 border-background shadow-lg"
                  onClick={() => fileRef.current.click()}
                >
                  <AvatarImage
                    src={imageUrl || currentUser?.profilePicture}
                    alt={currentUser?.username}
                    className={imageUploadProgress && imageUploadProgress < 100 ? "opacity-50" : ""}
                  />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {imageUploadProgress && imageUploadProgress < 100 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm font-medium">{imageUploadProgress}%</div>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 cursor-pointer"
                  onClick={() => fileRef.current.click()}>
                  <Upload className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
              <input
                type="file"
                ref={fileRef}
                onChange={handleImageFile}
                className="hidden"
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">Click to upload a new photo</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Change username"
                    defaultValue={currentUser?.username}
                    onChange={handleOnChange}
                    className="pl-9"
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
                    placeholder="Change email"
                    defaultValue={currentUser?.email}
                    onChange={handleOnChange}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    onChange={handleOnChange}
                    className="pl-9 pr-9"
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
            </div>

            <Button
              onClick={handleUpdateUser}
              className="w-full"
              disabled={loading || imageFileUploading}
            >
              {(loading || imageFileUploading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {imageFileUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UpdateProfile
