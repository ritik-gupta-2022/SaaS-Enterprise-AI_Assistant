"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ConfirmationModal({ isOpen, onClose, onConfirm, date, timeSlot }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#c0bbe5]">Confirm Appointment</DialogTitle>
          <DialogDescription className="text-gray-600">Please review your appointment details:</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm font-medium text-gray-700">
            Date: <span className="font-normal">{date?.toDateString()}</span>
          </p>
          <p className="text-sm font-medium text-gray-700 mt-2">
            Time: <span className="font-normal">{timeSlot}</span>
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#c0bbe5] text-[#c0bbe5] hover:bg-[#c0bbe5] hover:text-white transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-[#c0bbe5] text-white hover:bg-[#a9a3d9] transition-colors duration-200"
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

