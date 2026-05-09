import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function TimePicker({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false)
  
  // Parse value or use defaults
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 12, minute: 0, period: "AM" }
    const [hourStr, minuteStr] = timeStr.split(":")
    let hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)
    const period = hour >= 12 ? "PM" : "AM"
    if (hour > 12) hour -= 12
    if (hour === 0) hour = 12
    return { hour, minute, period }
  }

  const { hour, minute, period } = parseTime(value)
  const [selectedHour, setSelectedHour] = React.useState(hour)
  const [selectedMinute, setSelectedMinute] = React.useState(minute)
  const [selectedPeriod, setSelectedPeriod] = React.useState(period)

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)
  const periods = ["AM", "PM"]

  const hourRef = React.useRef(null)
  const minuteRef = React.useRef(null)

  // Scroll to selected values when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        const hourElement = hourRef.current?.querySelector(`[data-value="${selectedHour}"]`)
        const minuteElement = minuteRef.current?.querySelector(`[data-value="${selectedMinute}"]`)
        hourElement?.scrollIntoView({ block: "center", behavior: "auto" })
        minuteElement?.scrollIntoView({ block: "center", behavior: "auto" })
      }, 50)
    }
  }, [open, selectedHour, selectedMinute])

  // Update parent when values change
  const handleConfirm = () => {
    let hour24 = selectedHour
    if (selectedPeriod === "PM" && selectedHour !== 12) {
      hour24 = selectedHour + 12
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      hour24 = 0
    }
    const timeString = `${hour24.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`
    onChange(timeString)
    setOpen(false)
  }

  const handleClear = () => {
    onChange("")
    setOpen(false)
  }

  const formatDisplay = () => {
    if (!value) return "Pick a time"
    return `${selectedHour}:${selectedMinute.toString().padStart(2, "0")} ${selectedPeriod}`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-12 justify-start text-left font-normal rounded-xl",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplay()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-center">Select Time</div>
          
          <div className="flex gap-2 justify-center">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Hour</span>
              <div 
                ref={hourRef}
                className="h-36 w-14 overflow-y-auto border rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {hours.map((h) => (
                  <button
                    key={h}
                    data-value={h}
                    type="button"
                    onClick={() => setSelectedHour(h)}
                    className={cn(
                      "w-full py-2 text-center text-sm transition-colors hover:bg-accent",
                      selectedHour === h && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground pt-5">
              :
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Min</span>
              <div 
                ref={minuteRef}
                className="h-36 w-14 overflow-y-auto border rounded-lg [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {minutes.map((m) => (
                  <button
                    key={m}
                    data-value={m}
                    type="button"
                    onClick={() => setSelectedMinute(m)}
                    className={cn(
                      "w-full py-2 text-center text-sm transition-colors hover:bg-accent",
                      selectedMinute === m && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Period</span>
              <div className="h-36 w-14 border rounded-lg flex flex-col justify-center">
                {periods.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeriod(p)}
                    className={cn(
                      "w-full py-3 text-center text-sm font-medium transition-colors hover:bg-accent",
                      selectedPeriod === p && "bg-primary text-primary-foreground hover:bg-primary"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { TimePicker }
