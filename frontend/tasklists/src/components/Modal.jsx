import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AlertTriangle, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { useState } from "react"

export function WarningModal({ openModal, setOpenModal }) {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { uid } = useParams()
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart())
    setLoading(true)
    try {
      const res = await api.delete(`/api/v1/user/deleteAccount/${uid}`)
      if (res.status === 200) {
        dispatch(deleteUserSuccess(res?.data))
        navigate("/")
      } else {
        dispatch(deleteUserFailure(res?.data?.msg))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.response?.data?.msg))
    } finally {
      setLoading(false)
      setOpenModal(false)
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone and all your data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
