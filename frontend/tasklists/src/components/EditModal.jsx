import { useState } from "react"
import { useDispatch } from "react-redux"
import { Loader2, Scissors, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateTodoFailure } from "@/redux/todo/todoSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"

const EditModal = ({ setOpenModal, openModal, todo, setMessage, handleGetTodos }) => {
  const [editFormData, setEditFormData] = useState({
    name: todo.name,
    notes: todo.notes,
    status: todo.status,
  })
  const [loading, setLoading] = useState(false)
  const [breakdownLoading, setBreakdownLoading] = useState(false)
  const [breakdownError, setBreakdownError] = useState("")
  const dispatch = useDispatch()

  const handleClose = () => {
    setOpenModal(false)
    setEditFormData({
      name: todo.name,
      notes: todo.notes,
      status: todo.status,
    })
  }

  const handleUpdateTodo = async (id) => {
    setLoading(true)
    try {
      const response = await api.patch(`/api/v2/todos/${id}`, editFormData)
      if (response) {
        handleGetTodos()
        setMessage(response.data.msg)
        setOpenModal(false)
      } else {
        dispatch(updateTodoFailure("Something went wrong!"))
      }
    } catch (error) {
      dispatch(updateTodoFailure(error.response?.data?.msg))
    } finally {
      setLoading(false)
    }
  }

  const handleBreakdownTask = async () => {
    if (!editFormData.name || editFormData.name.length < 3) return
    setBreakdownLoading(true)
    setBreakdownError("")
    try {
      console.log("Calling breakdown API...")
      const response = await api.post('/api/v1/ai/breakdown', { 
        taskName: editFormData.name,
        taskNotes: editFormData.notes
      })
      console.log("Breakdown response:", response.data)
      if (response.data?.subtasks && response.data.subtasks.length > 0) {
        // Format subtasks as bullet points for notes
        const formattedNotes = response.data.subtasks
          .map(s => `• ${s.title}`)
          .join('\n')
        setEditFormData(prev => ({ ...prev, notes: formattedNotes }))
      } else {
        setBreakdownError("No subtasks generated. Try a more descriptive task name.")
      }
    } catch (error) {
      console.error("Failed to breakdown task:", error)
      setBreakdownError(error.response?.data?.msg || "Failed to generate subtasks. Please try again.")
    } finally {
      setBreakdownLoading(false)
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              maxLength={40}
              placeholder="Enter task name"
            />
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes">Notes</Label>
              <span className="text-xs text-muted-foreground">
                {editFormData.notes?.length || 0}/500
              </span>
            </div>
            <textarea
              id="notes"
              value={editFormData.notes}
              onChange={(e) =>
                setEditFormData({ ...editFormData, notes: e.target.value })
              }
              rows={4}
              maxLength={500}
              placeholder="Add any notes..."
              className={cn(
                "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                "ring-offset-background placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              )}
            />
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={editFormData.status}
              onChange={(e) =>
                setEditFormData({ ...editFormData, status: e.target.value })
              }
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <option value="pending">Pending</option>
              <option value="in-working">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* AI Breakdown Button */}
          <div className="pt-2 space-y-2">
            <Button 
              type="button"
              variant="outline"
              className="w-full border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-600"
              onClick={handleBreakdownTask}
              disabled={!editFormData.name || editFormData.name.length < 3 || breakdownLoading}
            >
              {breakdownLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Breaking down...
                </>
              ) : (
                <>
                  <Scissors className="mr-2 h-4 w-4" />
                  Break into Subtasks
                </>
              )}
            </Button>
            {breakdownError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {breakdownError}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={() => handleUpdateTodo(todo._id)} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditModal
