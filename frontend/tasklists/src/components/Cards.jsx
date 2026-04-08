import { useState } from "react"
import { useDispatch } from "react-redux"
import {
  Clock,
  Pencil,
  Trash2,
  Star,
  CheckCircle2,
  PlayCircle,
  Loader2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  addFavouriteFailure,
  deleteTodo,
  deleteTodoFailure,
} from "@/redux/todo/todoSlice"
import api from "@/axios/axios"
import EditModal from "./EditModal"
import { cn } from "@/lib/utils"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  },
  "in-working": {
    label: "In Progress",
    icon: PlayCircle,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
}

const Cards = ({ todo, setMessage, handleGetTodos }) => {
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const dispatch = useDispatch()

  const status = statusConfig[todo.status] || statusConfig.pending

  const handleRemoveTodo = async (id) => {
    setLoading(true)
    try {
      const response = await api.delete(`/api/v2/todos/${id}`)
      if (response) {
        dispatch(deleteTodo())
        handleGetTodos()
        setMessage(response?.data?.msg)
      } else {
        dispatch(deleteTodoFailure(response?.data.msg))
      }
    } catch (error) {
      dispatch(deleteTodoFailure(error.response?.data.msg))
    } finally {
      setLoading(false)
    }
  }

  const handleAddFavourite = async (id, addFavourite) => {
    try {
      const response = await api.patch(`/api/v2/todos/favourite/${id}`, {
        favourite: addFavourite,
      })
      if (response) {
        handleGetTodos()
        setMessage(
          addFavourite ? response?.data?.msg : "Removed from favorites"
        )
      }
    } catch (error) {
      dispatch(addFavouriteFailure(error.response?.data?.msg))
    }
  }

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          todo.favourite && "ring-2 ring-primary/50"
        )}
      >
        {/* Favorite Button */}
        <button
          onClick={() => handleAddFavourite(todo._id, !todo.favourite)}
          className="absolute top-4 right-4 z-10"
        >
          <Star
            className={cn(
              "h-5 w-5 transition-colors",
              todo.favourite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            )}
          />
        </button>

        <CardHeader className="pb-3">
          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3" />
            {new Date(todo.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight pr-8 line-clamp-2">
            {todo.name}
          </h3>

          {/* Status Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit mt-2",
              status.className
            )}
          >
            <status.icon className="h-3.5 w-3.5" />
            {status.label}
          </div>
        </CardHeader>

        <CardContent>
          {/* Notes */}
          {todo.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <FileText className="h-3 w-3" />
                Notes
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {todo.notes}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setOpenModal(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => handleRemoveTodo(todo._id)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      </Card>

      {openModal && (
        <EditModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          todo={todo}
          setMessage={setMessage}
          handleGetTodos={handleGetTodos}
        />
      )}
    </>
  )
}

export default Cards
