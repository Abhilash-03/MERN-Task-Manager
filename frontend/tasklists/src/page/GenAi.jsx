import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Sparkles, Send, AlertCircle, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { logoutSuccess } from "@/redux/user/userSlice"
import api from "@/axios/axios"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

const GenAi = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedAnswer, setGeneratedAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState(null)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)

  // Redirect if not logged in
  if (!currentUser) {
    navigate("/")
    return null
  }

  const handleGeneratingData = async () => {
    if (prompt.length < 3) return
    setQuestion(prompt)
    setError(null)
    try {
      setLoading(true)
      const response = await api.post(`/api/v1/ai/genai`, { prompt })
      setGeneratedAnswer(response.data)
    } catch (error) {
      console.log(error.response?.data)
      if (error.response?.status === 401) {
        dispatch(logoutSuccess())
        navigate("/")
      }
      setError(error.response?.data?.msg)
    } finally {
      setLoading(false)
    }
    setPrompt("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && prompt.length >= 3) {
      handleGeneratingData()
    }
  }

  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Hello, {currentUser?.username}!
        </h1>
        <p className="text-muted-foreground">
          Ask me anything about your tasks, productivity tips, or general questions
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Chat Area */}
      <Card className="mb-4 min-h-[400px] max-h-[500px] overflow-y-auto overflow-x-hidden">
        <CardContent className="p-6 space-y-6">
          {/* Default Message or Generated Answer */}
          {!generatedAnswer && !question ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Ask me about task management tips, productivity advice, or any
                questions you have. I'm here to help!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Question */}
              {question && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-1">You</p>
                    <p className="text-muted-foreground break-words">{question}</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1">AI Assistant</p>
                  {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      Generating response...
                    </div>
                  ) : generatedAnswer ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-4 prose-p:leading-7 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-headings:my-4 prose-headings:leading-tight prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:break-words prose-pre:bg-muted prose-pre:p-4 prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap prose-pre:break-words prose-blockquote:my-4 prose-hr:my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 leading-relaxed break-words overflow-hidden">
                      <ReactMarkdown>{generatedAnswer}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      A task manager app where you can create your tasks or todo-lists
                      and manage safely.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Area */}
      <div className="relative">
        <Input
          placeholder="Ask anything... (e.g., 'How can I be more productive?')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          className="h-14 pr-20 sm:pr-32 text-base"
        />
        <Button
          className="absolute right-2 top-2 h-10 px-3 sm:px-4"
          disabled={prompt.length < 3 || loading}
          onClick={handleGeneratingData}
        >
          <Send className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  )
}

export default GenAi
