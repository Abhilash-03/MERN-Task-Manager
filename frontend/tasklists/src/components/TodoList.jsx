import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ArrowRight, ListTodo } from "lucide-react"
import { getTodoFailure, getTodos } from "@/redux/todo/todoSlice"
import { logoutSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"

const TodoList = () => {
  const dispatch = useDispatch()
  const { lists } = useSelector((state) => state.todo)
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    const getAllItems = async () => {
      if (!currentUser) {
        navigate("/")
        return
      }
      try {
        const res = await api.get("/api/v2/todos")
        if (res.status === 200) {
          dispatch(getTodos(res?.data?.getTodo))
        } else {
          dispatch(getTodoFailure(res?.data.msg))
        }
      } catch (error) {
        dispatch(getTodoFailure(error.response?.data.msg))
        if (error.response?.status === 401) {
          dispatch(logoutSuccess())
          navigate("/")
        }
      }
    }

    getAllItems()
  }, [dispatch, currentUser, navigate])

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <ListTodo className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No tasks yet</p>
      </div>
    )
  }

  const sortedTasks = [...lists].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const recentTasks = sortedTasks.slice(0, 6)

  return (
    <div className="space-y-1">
      {recentTasks.map((item) => (
        <Link
          key={item?._id}
          to="/lists"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2.5 rounded-lg",
            "hover:bg-muted/80 transition-colors group cursor-pointer"
          )}
        >
          <div
            className={cn(
              "h-2 w-2 rounded-full flex-shrink-0",
              item?.status === "completed"
                ? "bg-emerald-500"
                : item?.status === "in-working"
                ? "bg-amber-500"
                : "bg-primary"
            )}
          />
          <span className={cn(
            "text-sm truncate flex-1",
            item?.status === "completed" && "text-muted-foreground line-through"
          )}>
            {item?.name}
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </Link>
      ))}
      {lists.length > 6 && (
        <Link
          to="/lists"
          className="block text-center py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          +{lists.length - 6} more tasks
        </Link>
      )}
    </div>
  )
}

export default TodoList
