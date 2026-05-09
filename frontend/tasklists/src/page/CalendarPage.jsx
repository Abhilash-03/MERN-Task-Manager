import { useState, useEffect, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO
} from "date-fns"
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CalendarDays,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { logoutSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  "in-working": "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30"
}

const statusIcons = {
  pending: Clock,
  "in-working": PlayCircle,
  completed: CheckCircle2
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fetchCalendarTasks = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/v2/todos/calendar")
      if (res.status === 200) {
        setTasks(res.data.tasks)
      }
    } catch (error) {
      console.error("Failed to fetch calendar tasks:", error)
      if (error.response?.status === 401) {
        dispatch(logoutSuccess())
        navigate("/")
      }
    } finally {
      setLoading(false)
    }
  }, [dispatch, navigate])

  useEffect(() => {
    if (!currentUser) {
      navigate("/")
      return
    }
    fetchCalendarTasks()
  }, [currentUser, navigate, fetchCalendarTasks])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday)
  const startDayOfWeek = monthStart.getDay()

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false
      const taskDate = parseISO(task.dueDate)
      return isSameDay(taskDate, date)
    })
  }

  // Get selected date's tasks
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  if (!currentUser) {
    return null
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-8 w-8 text-primary" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage your tasks by date
          </p>
        </div>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {format(currentMonth, "MMMM yyyy")}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: startDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24 p-1" />
              ))}

              {/* Days of the month */}
              {daysInMonth.map((day) => {
                const dayTasks = getTasksForDate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const today = isToday(day)

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "h-24 p-1 border rounded-lg text-center transition-all hover:bg-accent/50 overflow-hidden",
                      isSelected && "ring-2 ring-primary bg-accent/50",
                      today && "border-primary",
                      !isSameMonth(day, currentMonth) && "opacity-50"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1 text-center",
                      today && "text-primary font-bold"
                    )}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-0.5">
                      {dayTasks.slice(0, 2).map((task) => {
                        const StatusIcon = statusIcons[task.status] || Clock
                        return (
                          <div
                            key={task._id}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded border truncate flex items-center gap-1",
                              statusColors[task.status]
                            )}
                          >
                            <StatusIcon className="h-3 w-3 shrink-0" />
                            <span className="truncate">{task.name}</span>
                          </div>
                        )
                      })}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-muted-foreground px-1">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Tasks Panel */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl sm:text-2xl">
              {selectedDate 
                ? format(selectedDate, "EEEE")
                : "Select a date"
              }
            </CardTitle>
            {selectedDate && (
              <p className="text-lg text-muted-foreground">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-muted-foreground text-sm">
                Click on a date to view tasks
              </p>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">
                  No tasks scheduled for this date
                </p>
                <Button asChild size="sm">
                  <Link to="/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => {
                  const StatusIcon = statusIcons[task.status] || Clock
                  return (
                    <div
                      key={task._id}
                      className={cn(
                        "p-3 rounded-lg border",
                        statusColors[task.status]
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <StatusIcon className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{task.name}</p>
                          {task.dueTime && (
                            <p className="text-xs mt-1 opacity-80">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {task.dueTime}
                            </p>
                          )}
                          {task.notes && (
                            <p className="text-xs mt-1 opacity-80 line-clamp-2">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
        <span className="text-muted-foreground">Status:</span>
        {Object.entries(statusColors).map(([status, colors]) => {
          const Icon = statusIcons[status]
          return (
            <div key={status} className={cn("flex items-center gap-1.5 px-2 py-1 rounded border", colors)}>
              <Icon className="h-3 w-3" />
              <span className="capitalize">{status === "in-working" ? "In Progress" : status}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarPage
