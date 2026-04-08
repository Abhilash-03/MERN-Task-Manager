import { Link } from "react-router-dom"
import { Sparkles, Heart } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Task Manager
            </span>
          </Link>

          {/* Center - Tagline */}
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for productivity
          </p>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Task Manager
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
