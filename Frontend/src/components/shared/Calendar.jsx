"use client"

import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"



export function Calendar({ selectedDate, onSelect }) {
  const [error, setError] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handleSelect = (date) => {
    if (date) {
      const day = date.getDay()
      if (day === 0 || day === 6) {
        setError("Please book for office hours (Monday to Friday).")
        return
      }
    }
    setError(null)
    onSelect(date)
  }

  const isDateDisabled = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 || date.getDay() === 6
  }

  const handlePreviousMonth = () => {
    const previousMonth = new Date(currentMonth)
    previousMonth.setMonth(previousMonth.getMonth() - 1)

    const today = new Date()
    if (previousMonth.getMonth() >= today.getMonth() || previousMonth.getFullYear() > today.getFullYear()) {
      setCurrentMonth(previousMonth)
    }
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  const isPreviousMonthDisabled = () => {
    const previousMonth = new Date(currentMonth)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const today = new Date()
    return previousMonth.getMonth() < today.getMonth() && previousMonth.getFullYear() <= today.getFullYear()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth} disabled={isPreviousMonthDisabled()}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h2 className="font-semibold">{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        disabled={isDateDisabled}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className="rounded-md border shadow p-3"
        classNames={{
          day_selected: "bg-[#c0bbe5] text-white hover:bg-[#a9a3d9] focus:bg-[#a9a3d9]",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...Array.from({ length: 7 }).reduce(
            (acc, _, i) => ({ ...acc, [`day_selected_start`]: "bg-[#c0bbe5] text-white hover:bg-[#a9a3d9]" }),
            {},
          ),
        }}
      />
      {error && (
        <p className="text-red-500 mt-2 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

