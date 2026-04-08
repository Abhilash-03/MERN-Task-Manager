import { User, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

const SideBar = () => {
  const { currentUser } = useSelector((state) => state.user)
  const location = useLocation()
  const [tab, setTab] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")
    setTab(tabFromUrl)
  }, [location.search])

  if (!currentUser) return null

  const navItems = [
    {
      label: "Profile",
      icon: User,
      href: `/user-profile/${currentUser._id}?tab=profile`,
      tab: "profile",
    },
    {
      label: "Update Profile",
      icon: Settings,
      href: `/update-profile/${currentUser._id}?tab=update`,
      tab: "update",
    },
  ]

  return (
    <aside className="w-full lg:w-60 lg:min-h-screen border-b lg:border-r lg:border-b-0 bg-muted/30">
      <nav className="flex lg:flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link key={item.tab} to={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                tab === item.tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default SideBar
