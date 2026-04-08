import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  ArrowRight,
  CheckCircle2,
  ListTodo,
  Calendar,
  Bell,
  Sparkles,
  Shield,
  Zap,
  Target,
  Users,
  BarChart3,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const LandingPage = ({ onOpenAuth }) => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>AI-Powered Task Management</span>
            </div>

            {/* Heading */}
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Organize Your Life with{" "}
                <span className="text-primary">Task Manager</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                The smart way to manage your tasks. Stay focused, get more done, and achieve
                your goals with our intuitive task management platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {currentUser ? (
                <>
                  <Button size="xl" asChild>
                    <Link to="/create">
                      Create New Task
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="xl" variant="outline" asChild>
                    <Link to="/lists">View My Tasks</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="xl" onClick={onOpenAuth}>
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="xl" variant="outline" onClick={onOpenAuth}>
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t w-full max-w-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Powerful Features
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Everything you need to stay organized and boost your productivity
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1",
                  "bg-background/60 backdrop-blur-sm"
                )}
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Task Manager Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose Task Manager?
              </h2>
              <p className="text-lg text-muted-foreground">
                Task Manager is designed to help you achieve more with less effort.
                Our intuitive interface and powerful features make task management
                a breeze.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl" />
              <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl border p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-semibold">Today's Tasks</h3>
                  <span className="text-sm text-muted-foreground">3 of 5 done</span>
                </div>
                {sampleTasks.map((task, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      task.completed ? "bg-muted/50" : "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                        task.completed
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {task.completed && (
                        <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={cn(
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              What You Can Do
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-lg">
              Task Manager empowers you to take control of your productivity
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="text-center space-y-4 p-6 rounded-xl bg-background/60 backdrop-blur-sm border hover:shadow-lg transition-all"
              >
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <capability.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{capability.title}</h3>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
            <div className="relative flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[600px] text-primary-foreground/80 text-lg">
                Join thousands of users who are already managing their tasks more
                effectively with Task Manager.
              </p>
              {currentUser ? (
                <Button size="xl" variant="secondary" asChild>
                  <Link to="/create">
                    Create Your First Task
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button size="xl" variant="secondary" onClick={onOpenAuth}>
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Data
const features = [
  {
    icon: ListTodo,
    title: "Smart Task Lists",
    description: "Create and organize tasks with categories, priorities, and due dates.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Get intelligent suggestions and automate repetitive tasks with AI.",
  },
  {
    icon: Calendar,
    title: "Calendar Integration",
    description: "Sync your tasks with your calendar for better time management.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss a deadline with customizable notifications and alerts.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visualize your productivity with detailed analytics and reports.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected with enterprise-grade security.",
  },
]

const benefits = [
  {
    title: "Boost Productivity",
    description: "Complete tasks 40% faster with our streamlined workflow system.",
  },
  {
    title: "Stay Organized",
    description: "Keep all your tasks, notes, and deadlines in one central place.",
  },
  {
    title: "Reduce Stress",
    description: "Clear your mind by capturing everything that needs to be done.",
  },
  {
    title: "Achieve Goals",
    description: "Break down big goals into manageable tasks and track your progress.",
  },
]

const sampleTasks = [
  { title: "Complete project proposal", completed: true },
  { title: "Review team feedback", completed: true },
  { title: "Update documentation", completed: true },
  { title: "Schedule team meeting", completed: false },
  { title: "Prepare presentation", completed: false },
]

const capabilities = [
  {
    icon: Target,
    title: "Set Goals",
    description: "Define clear objectives and break them into actionable tasks.",
  },
  {
    icon: Clock,
    title: "Track Time",
    description: "Monitor how much time you spend on different tasks.",
  },
  {
    icon: Users,
    title: "Collaborate",
    description: "Share tasks and work together with your team.",
  },
  {
    icon: Zap,
    title: "Automate",
    description: "Set up recurring tasks and automated workflows.",
  },
]

export default LandingPage
