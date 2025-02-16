"use client"

import { useState } from "react"
import { Calendar } from "./Calendar"
import { TimeSlotPicker } from "./TimeSlotPicker"
import { ConfirmationModal } from "./ConfirmationModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast,ToastContainer } from "react-toastify"
import { CHAT_BACKEND_URL } from "../../constant"
export function AppointmentScheduler({email,businessid}) {
  // console.log('Email:', email);
  // console.log('Business ID:', businessid);
  const [selectedDate, setSelectedDate] = useState(undefined)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(undefined)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTimeSlot(undefined)
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleBookAppointment = () => {
    setIsConfirmationOpen(true)
  }

  const handleConfirmAppointment = async () => {
    console.log("Appointment booked:", { date: selectedDate, timeSlot: selectedTimeSlot })
    const response = await fetch(`${CHAT_BACKEND_URL}/book`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({
      date: selectedDate,
      slot: selectedTimeSlot,
      email: email,
      businessId: businessid,
      }),
    });

    if (response.ok) {
      toast.success("Appointment booked successfully!");
    } else {("Failed to book appointment. Please try again.");
    }
    setIsConfirmationOpen(false)
    setSelectedDate(undefined)
    setSelectedTimeSlot(undefined)
  }

  const isWeekend = selectedDate ? [0, 6].includes(selectedDate.getDay()) : false

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg">
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="">
            <Calendar selectedDate={selectedDate} onSelect={handleDateSelect} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-[#c0bbe5]">Select Time</h3>
            {selectedDate ? (
              isWeekend ? (
                <p className="text-red-500 italic">Please select a weekday for booking.</p>
              ) : (
                <TimeSlotPicker
                  date={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onSelect={handleTimeSlotSelect}
                />
              )
            ) : (
              <p className="text-gray-500 italic">Please select a date first</p>
            )}
          </div>
        </div>
        {selectedDate && selectedTimeSlot && !isWeekend && (
          <div className="mt-6">
            <Button
              onClick={handleBookAppointment}
              className="w-full bg-[#c0bbe5] text-white hover:bg-[#a9a3d9] transition-colors duration-200"
            >
              Book Appointment
            </Button>
          </div>
        )}
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleConfirmAppointment}
          date={selectedDate}
          timeSlot={selectedTimeSlot}
        />
      </CardContent>
      <ToastContainer />
    </Card>
  )
}

