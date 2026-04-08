import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { 
  PenLine, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Target,
  FileText,
  ArrowRight,
  ListTodo,
  Loader2,
  Wand2,
  Bot,
  RefreshCw,
  Scissors,
  BrainCircuit,
  Pencil,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TodoList from "@/components/TodoList"
import { addTodo, addTodoFailure } from "@/redux/todo/todoSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"

const CreateTodo = () => {
  const [newTodo, setNewTodo] = useState({ name: "", notes: "" })
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [aiPrompt, setAiPrompt] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState("")
  const [motivation, setMotivation] = useState({ quote: "", emoji: "🚀" })
  const [suggestions, setSuggestions] = useState([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState("")
  const [breakdownLoading, setBreakdownLoading] = useState(false)
  const [breakdownError, setBreakdownError] = useState("")
  const [subtasks, setSubtasks] = useState([])
  const [activeTab, setActiveTab] = useState("manual")
  const [showRecentTasks, setShowRecentTasks] = useState(false)
  const dispatch = useDispatch()
  const { error, lists } = useSelector((state) => state.todo)
  const { currentUser } = useSelector((state) => state.user)
  const inputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  // Fetch daily motivation on mount (cached for 2 hours)
  useEffect(() => {
    const CACHE_DURATION = 2 * 60 * 60 * 1000
    
    const fetchMotivation = async () => {
      const cached = localStorage.getItem('dailyMotivation')
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        const isValid = Date.now() - timestamp < CACHE_DURATION
        if (isValid && data) {
          setMotivation(data)
          return
        }
      }
      
      try {
        const response = await api.post('/api/v1/ai/motivation', { 
          username: currentUser?.username 
        })
        if (response.data) {
          setMotivation(response.data)
          localStorage.setItem('dailyMotivation', JSON.stringify({
            data: response.data,
            timestamp: Date.now()
          }))
        }
      } catch (error) {
        console.error("Failed to fetch motivation:", error)
      }
    }
    if (currentUser) {
      fetchMotivation()
    }
  }, [currentUser])

  if (!currentUser) {
    return null
  }

  // Fetch smart suggestions
  const fetchSuggestions = async () => {
    setSuggestionsLoading(true)
    setSuggestionsError("")
    try {
      const response = await api.post('/api/v1/ai/suggestions', { 
        existingTasks: lists 
      })
      if (response.data?.suggestions) {
        setSuggestions(response.data.suggestions)
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error)
      setSuggestionsError(error.response?.data?.msg || "Failed to get suggestions")
    } finally {
      setSuggestionsLoading(false)
    }
  }

  // Break down task into subtasks
  const handleBreakdownTask = async () => {
    if (!newTodo.name || newTodo.name.length < 3) return
    setBreakdownLoading(true)
    setBreakdownError("")
    setSubtasks([])
    try {
      const response = await api.post('/api/v1/ai/breakdown', { 
        taskName: newTodo.name,
        taskNotes: newTodo.notes
      })
      if (response.data?.subtasks) {
        setSubtasks(response.data.subtasks)
      }
    } catch (error) {
      console.error("Failed to breakdown task:", error)
      setBreakdownError(error.response?.data?.msg || "Failed to break down task")
    } finally {
      setBreakdownLoading(false)
    }
  }

  // Add subtask as a new task
  const handleAddSubtask = async (subtask) => {
    try {
      const response = await api.post("/api/v2/todos", { 
        name: subtask.title, 
        notes: subtask.notes 
      })
      if (response.status === 201) {
        dispatch(addTodo(response?.data?.todoList))
        setSubtasks(prev => prev.filter(s => s.title !== subtask.title))
      }
    } catch (error) {
      console.error("Failed to add subtask:", error)
    }
  }

  // Use suggestion to fill form
  const useSuggestion = (suggestion) => {
    setNewTodo({ name: suggestion.title, notes: "" })
    setActiveTab("manual")
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleOnChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value })
  }

  const handleAddTodo = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      dispatch(addTodoFailure(null))
      const response = await api.post("/api/v2/todos", newTodo)
      if (response.status === 201) {
        dispatch(addTodo(response?.data?.todoList))
        setMessage(response?.data?.msg)
        setNewTodo({ name: "", notes: "" })
        setSubtasks([])
      } else {
        dispatch(addTodoFailure(response?.data?.msg))
      }
    } catch (error) {
      dispatch(addTodoFailure(error.response?.data?.msg))
    }
  }

  setTimeout(() => {
    dispatch(addTodoFailure(null))
    setMessage("")
    setAiError("")
  }, 3200)

  const handleGenerateTask = async () => {
    if (aiPrompt.length < 3) return
    setAiError("")
    setAiLoading(true)
    try {
      const response = await api.post('/api/v1/ai/generate-task', { prompt: aiPrompt })
      if (response.data) {
        setNewTodo({
          name: response.data.title || "",
          notes: response.data.content || ""
        })
        setAiPrompt("")
        setActiveTab("manual")
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    } catch (error) {
      console.error("AI generation error:", error)
      setAiError(error.response?.data?.msg || "Failed to generate task")
    } finally {
      setAiLoading(false)
    }
  }

  const completedCount = lists?.filter(t => t.status === 'completed')?.length || 0
  const totalCount = lists?.length || 0
  const pendingCount = totalCount - completedCount
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Top Row - Title and Stats */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Title + Motivation */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                    <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Task</h1>
                    <p className="text-sm text-muted-foreground hidden sm:block">Add new tasks to your list</p>
                  </div>
                </div>
                {motivation.quote && (
                  <div className="flex items-start gap-2 rounded-lg bg-background/60 backdrop-blur-sm border p-3 max-w-md">
                    <span className="text-xl flex-shrink-0">{motivation.emoji}</span>
                    <p className="text-sm text-muted-foreground italic leading-relaxed">{motivation.quote}</p>
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:flex sm:flex-row">
                <div className="flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border p-2 sm:p-3 sm:min-w-[90px] shadow-sm">
                  <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-1" />
                  <span className="text-lg sm:text-2xl font-bold text-primary">{totalCount}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Total</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border p-2 sm:p-3 sm:min-w-[90px] shadow-sm">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mb-1" />
                  <span className="text-lg sm:text-2xl font-bold text-amber-500">{pendingCount}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Pending</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm border p-2 sm:p-3 sm:min-w-[90px] shadow-sm">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 mb-1" />
                  <span className="text-lg sm:text-2xl font-bold text-emerald-500">{completedCount}</span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Done</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
              <div className="flex items-center gap-3 rounded-lg bg-background/60 backdrop-blur-sm border p-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                    <span className="text-xs font-bold text-primary">{completionRate}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive animate-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">Task created successfully!</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Column - Task Creation */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 sm:h-14 rounded-xl p-1 bg-muted/50">
                <TabsTrigger 
                  value="manual" 
                  className="rounded-lg text-sm sm:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  <span className="hidden xs:inline">Write</span> Manually
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="rounded-lg text-sm sm:text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  AI <span className="hidden xs:inline">Assist</span>
                </TabsTrigger>
              </TabsList>

              {/* Manual Tab */}
              <TabsContent value="manual" className="mt-4 sm:mt-6 space-y-4">
                <Card className={cn(
                  "border-2 transition-all duration-300 shadow-sm",
                  isFocused ? "border-primary/50 shadow-lg shadow-primary/10" : "border-transparent"
                )}>
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-inner">
                        <PenLine className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">New Task</CardTitle>
                        <CardDescription className="text-sm sm:text-base">Fill in the details below to create your task</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 sm:space-y-6">
                    <form onSubmit={handleAddTodo} className="space-y-5 sm:space-y-6">
                      {/* Task Name */}
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="name" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                          <Target className="h-4 w-4 text-primary" />
                          Task Name
                          <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="What do you need to do?"
                            value={newTodo.name}
                            onChange={handleOnChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            ref={inputRef}
                            required
                            maxLength={40}
                            minLength={2}
                            className="h-12 sm:h-14 text-base sm:text-lg pr-16 rounded-xl"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground font-medium">
                            {newTodo.name.length}/40
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notes" className="flex items-center gap-2 text-sm sm:text-base font-medium">
                            <FileText className="h-4 w-4 text-primary" />
                            Notes
                            <span className="text-muted-foreground text-xs sm:text-sm font-normal">(optional)</span>
                          </Label>
                          <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                            {newTodo.notes.length}/500
                          </span>
                        </div>
                        <textarea
                          id="notes"
                          name="notes"
                          placeholder="Add any details, links, or context..."
                          value={newTodo.notes}
                          onChange={handleOnChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          rows={4}
                          maxLength={500}
                          className={cn(
                            "flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm sm:text-base",
                            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            "resize-none transition-colors"
                          )}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button type="submit" size="lg" className="flex-1 h-12 sm:h-14 text-base sm:text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                          <Plus className="mr-2 h-5 w-5" />
                          Create Task
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="lg"
                          className="h-12 sm:h-14 px-6 gap-2 rounded-xl border-2"
                          onClick={handleBreakdownTask}
                          disabled={!newTodo.name || newTodo.name.length < 3 || breakdownLoading}
                          title="AI will break this task into smaller subtasks"
                        >
                          {breakdownLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Scissors className="h-5 w-5" />
                          )}
                          <span>Break Down</span>
                        </Button>
                      </div>
                    </form>

                    {/* Breakdown Error */}
                    {breakdownError && (
                      <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{breakdownError}</p>
                      </div>
                    )}

                    {/* Subtasks */}
                    {subtasks.length > 0 && (
                      <div className="rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border-2 border-primary/20 p-4 sm:p-6">
                        <h4 className="font-semibold text-base sm:text-lg flex items-center gap-2 mb-4">
                          <Scissors className="h-5 w-5 text-primary" />
                          Subtasks
                          <span className="text-xs sm:text-sm font-normal text-muted-foreground">(click to add)</span>
                        </h4>
                        <div className="space-y-2 sm:space-y-3">
                          {subtasks.map((subtask, index) => (
                            <div 
                              key={index}
                              onClick={() => handleAddSubtask(subtask)}
                              className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-background hover:bg-primary/5 cursor-pointer transition-all border-2 border-transparent hover:border-primary/30 group shadow-sm hover:shadow-md"
                            >
                              <div className="flex-1 min-w-0 mr-3">
                                <p className="font-medium text-sm sm:text-base">{subtask.title}</p>
                                {subtask.notes && (
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">{subtask.notes}</p>
                                )}
                              </div>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                                <Plus className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Tab */}
              <TabsContent value="ai" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
                {/* AI Generator Card */}
                <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 shadow-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <Wand2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl sm:text-2xl">Generate with AI</CardTitle>
                        <CardDescription className="text-sm sm:text-base">Describe what you want to do in plain language</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiError && (
                      <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-destructive">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{aiError}</p>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="e.g., Prepare for tomorrow's team meeting..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerateTask()}
                        className="flex-1 h-12 sm:h-14 text-base rounded-xl"
                        disabled={aiLoading}
                      />
                      <Button 
                        onClick={handleGenerateTask}
                        disabled={aiPrompt.length < 3 || aiLoading}
                        size="lg"
                        className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all"
                      >
                        {aiLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      AI will create a task title and notes for you. You can edit before creating.
                    </p>
                  </CardContent>
                </Card>

                {/* Smart Suggestions Card */}
                <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 shadow-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shadow-inner">
                          <BrainCircuit className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-500" />
                        </div>
                        <div>
                          <CardTitle className="text-xl sm:text-2xl">Smart Suggestions</CardTitle>
                          <CardDescription className="text-sm sm:text-base">AI ideas based on your existing tasks</CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={fetchSuggestions}
                        disabled={suggestionsLoading}
                        className="gap-2 h-10 sm:h-11 rounded-xl border-2 border-emerald-500/30 hover:bg-emerald-500/10"
                      >
                        {suggestionsLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        {suggestions.length > 0 ? 'Refresh' : 'Get Ideas'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {suggestionsError && (
                      <div className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-destructive mb-4">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm">{suggestionsError}</p>
                      </div>
                    )}
                    
                    {suggestions.length > 0 ? (
                      <div className="grid gap-2 sm:gap-3">
                        {suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            onClick={() => useSuggestion(suggestion)}
                            className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-background hover:bg-emerald-500/10 cursor-pointer transition-all border-2 border-transparent hover:border-emerald-500/30 group shadow-sm hover:shadow-md"
                          >
                            <div className="flex-1 min-w-0 mr-3">
                              <p className="font-medium text-sm sm:text-base">{suggestion.title}</p>
                              {suggestion.reason && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{suggestion.reason}</p>
                              )}
                            </div>
                            <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all">
                              <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                          <BrainCircuit className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-500/50" />
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground">Click "Get Ideas" to get AI-powered task suggestions</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Recent Tasks (Desktop) */}
          <div className="hidden xl:block w-80 2xl:w-96 flex-shrink-0">
            <Card className="sticky top-24 border-2 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ListTodo className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Recent Tasks</CardTitle>
                  </div>
                  <Link to="/lists">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-14rem)] overflow-y-auto">
                <TodoList />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Recent Tasks (Collapsible) */}
        <div className="xl:hidden mt-6">
          <Card className="border-2 shadow-sm">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setShowRecentTasks(!showRecentTasks)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ListTodo className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Recent Tasks</CardTitle>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{totalCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/lists" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                  {showRecentTasks ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            {showRecentTasks && (
              <CardContent className="max-h-[50vh] overflow-y-auto border-t">
                <TodoList />
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* AI Chat FAB */}
      <Link to="/genai">
        <Button
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-xl hover:scale-110 transition-all bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          size="icon"
        >
          <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </Link>
    </div>
  )
}

export default CreateTodo

