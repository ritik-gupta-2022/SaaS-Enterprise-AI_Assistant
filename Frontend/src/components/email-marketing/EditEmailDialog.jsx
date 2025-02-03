"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function EditEmailDialog({ open, onOpenChange, onSubmit, initialContent }) {
  const [emailContent, setEmailContent] = useState(initialContent || "")

  useEffect(() => {
    if (open) {
      setEmailContent(initialContent || "")
    }
  }, [open, initialContent])

  const handleSubmit = () => {
    onSubmit(emailContent)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-500">This email will be sent to campaign members</p>
          <div className="space-y-2">
            <Textarea
              id="email-message"
              placeholder="Your email content..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <Button className="w-full bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

