import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  ListTodo,
  Clock,
  CheckCircle2,
  PlayCircle,
  Heart,
  Plus,
  AlertCircle,
  CheckCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Cards from "@/components/Cards"
import { filterTodo, getTodoFailure, getTodos } from "@/redux/todo/todoSlice"
import { logoutSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"

const filterOptions = [
  { id: "all", label: "All", icon: ListTodo },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "in-working", label: "In Progress", icon: PlayCircle },
  { id: "completed", label: "Completed", icon: CheckCircle2 },
  { id: "favourite", label: "Favorites", icon: Heart },
]

const Lists = () => {
  const { lists, error, filteredTodo } = useSelector((state) => state.todo)
  const { currentUser } = useSelector((state) => state.user)
  const [message, setMessage] = useState("")
  const [filterName, setFilterName] = useState("all")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGetTodos = useCallback(() => {
    dispatch(getTodoFailure(null))
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
        dispatch(getTodoFailure(error.res?.data.msg))
        if (error.response?.status === 401) {
          dispatch(logoutSuccess())
          navigate("/")
        }
      }
    }
    getAllItems()
  }, [dispatch, currentUser, navigate])

  const handleFilterChange = (type) => {
    dispatch(filterTodo({ type }))
    setFilterName(type)
  }

  useEffect(() => {
    handleGetTodos()
  }, [handleGetTodos])

  useEffect(() => {
    handleFilterChange(filterName)
  }, [filterName, lists])

  setTimeout(() => {
    dispatch(getTodoFailure(null))
    setMessage("")
  }, 3000)

  const displayedTasks = filterName === "all" ? lists : filteredTodo

  // Redirect if not logged in
  if (!currentUser) {
    navigate("/")
    return null
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your tasks in one place
          </p>
        </div>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {message && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
          <CheckCheck className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lists.length}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lists.filter((t) => t.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <PlayCircle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lists.filter((t) => t.status === "in-working").length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {lists.filter((t) => t.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((filter) => (
          <Button
            key={filter.id}
            variant={filterName === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterName(filter.id)}
            className={cn(
              "transition-all",
              filterName === filter.id && "shadow-md"
            )}
          >
            <filter.icon className="mr-2 h-4 w-4" />
            {filter.label}
            {filter.id === "all" && (
              <span className="ml-2 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                {lists.length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Task Grid */}
      {displayedTasks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...displayedTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((todo) => (
            <Cards
              key={todo._id}
              todo={todo}
              setMessage={setMessage}
              handleGetTodos={handleGetTodos}
            />
          ))}
        </div>
      ) : (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {filterName === "all"
                ? "No tasks yet"
                : `No ${filterName} tasks`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filterName === "all"
                ? "Create your first task to get started"
                : `You don't have any ${filterName} tasks`}
            </p>
            {filterName === "all" && (
              <Button asChild>
                <Link to="/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Lists
