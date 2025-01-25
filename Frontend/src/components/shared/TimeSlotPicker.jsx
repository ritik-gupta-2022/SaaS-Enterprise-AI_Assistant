"use client"

import { Button } from "@/components/ui/button"


export function TimeSlotPicker({ date, selectedTimeSlot, onSelect }) {
  const generateTimeSlots = (date) => {
    const slots = []
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots(date)

  return (
    <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
      {timeSlots.map((slot) => (
        <Button
          key={slot}
          variant={selectedTimeSlot === slot ? "default" : "outline"}
          onClick={() => onSelect(slot)}
          className={`
            ${
              selectedTimeSlot === slot
                ? "bg-[#c0bbe5] text-white hover:bg-[#a9a3d9]"
                : "text-[#c0bbe5] border-[#c0bbe5] hover:bg-[#c0bbe5] hover:text-white"
            }
            transition-colors duration-200
          `}
        >
          {slot}
        </Button>
      ))}
    </div>
  )
}

