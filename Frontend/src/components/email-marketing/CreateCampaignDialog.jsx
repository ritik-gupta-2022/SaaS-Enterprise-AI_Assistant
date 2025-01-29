import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function CreateCampaignDialog({ open, onOpenChange, onSubmit }) {
  const [campaignName, setCampaignName] = useState("")

  const handleSubmit = () => {
    if (campaignName.trim()) {
      onSubmit(campaignName.trim())
      setCampaignName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="campaign-name"
              placeholder="Your campaign name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button className="w-full bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800" onClick={handleSubmit}>
            Create Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

