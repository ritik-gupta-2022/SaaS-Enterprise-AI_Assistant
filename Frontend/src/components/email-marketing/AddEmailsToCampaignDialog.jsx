
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function AddEmailsToCampaignDialog({ open, onOpenChange, campaign, emails, onSubmit}) {
  const [selectedEmails, setSelectedEmails] = useState(campaign? campaign.emails : [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEmails, setFilteredEmails] = useState([]);

  useEffect(() => {

    if (open) {
      setSelectedEmails(campaign? campaign.emails : [])
      setSearchTerm("")
      setFilteredEmails(emails?.filter(
        (email) =>
          email.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    }
    console.log(selectedEmails)
    console.log(emails)
    console.log(filteredEmails)
  }, [open])

  
  
  const handleSubmit = () => {
    onSubmit(selectedEmails)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Emails to Campaign: {campaign?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4 relative">
            <Input
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredEmails?.map((email,index) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <Checkbox
                  checked={selectedEmails?.includes(email.email)}
                  onCheckedChange={(checked) => {
                    setSelectedEmails((prevSelected) =>
                      checked
                        ? [...prevSelected, email.email]
                        : prevSelected.filter((e) => e !== email.email)
                    )
                  }}
                />
                <span>{email.email}</span>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800" onClick={handleSubmit}>
          Add Selected Emails
        </Button>
      </DialogContent>
    </Dialog>
  )
}

