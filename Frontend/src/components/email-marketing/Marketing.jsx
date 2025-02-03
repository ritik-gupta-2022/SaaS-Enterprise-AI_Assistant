
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CreateCampaignDialog } from "./CreateCampaignDialog"
import { EditEmailDialog } from "./EditEmailDialog"
import { AddEmailsToCampaignDialog } from "./AddEmailsToCampaignDialog"
import { CalendarIcon, Users, PlusCircle, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux"
import { FRONTEND_URL } from "../../constant"
import { toast } from "react-toastify"

// Dummy data
const dummyEmails= Array(20)
  .fill(null)
  .map((_, i) => ({
    id: `email-${i + 1}`,
    email: `user${i + 1}@example.com`,
    answers: "View",
    domain: `example${(i % 3) + 1}.com`,
  }))

const dummyCampaigns = [
  { id: "1", name: "Summer Sale", created: "June 1", customers: 0 },
  { id: "2", name: "New Product Launch", created: "June 15", customers: 0 },
  { id: "3", name: "Customer Feedback", created: "June 20", customers: 0 },
]

export default function Marketing() {
  const [emails, setEmails] = useState(dummyEmails)
  const [campaigns, setCampaigns] = useState(dummyCampaigns)
  const [loading, setLoading] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addEmailsDialogOpen, setAddEmailsDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [emailSearchTerm, setEmailSearchTerm] = useState("")
  const [campaignSearchTerm, setCampaignSearchTerm] = useState("")

  const currentUser = useSelector((state)=>state.user);

  useEffect(()=>{
    const getEmail = async () =>{
      try{
        const id = currentUser.currentUser._id
        // console.log(id);
        const res = await fetch(`${FRONTEND_URL}/api/marketing/getemail/${id}`,{
          credentials:'include'
        })
        const data = await res.json();

        if(res.ok){
          // console.log(data);
          setEmails(data);
        }
      }
      catch(err){
        console.log(err);
        toast.error(err.message)
      }
    }
    getEmail();
  },[])


  const filteredEmails = emails.filter(
    (email) =>
      email.email.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
      email.domain.toLowerCase().includes(emailSearchTerm.toLowerCase()),
  )

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(campaignSearchTerm.toLowerCase()),
  )

  const handleDeleteCampaign = (campaignId) => {
    setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId))
  }

  const handleAddEmailsToCampaign = (campaignId, emailIds) => {
    setCampaigns(
      campaigns.map((campaign) =>
        campaign.id === campaignId ? { ...campaign, customers: campaign.customers + emailIds.length } : campaign,
      ),
    )
  }

  const handleCreateCampaign = (name) => {
    const newCampaign = {
      id: `campaign-${campaigns.length + 1}`,
      name,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      customers: 0,
    }
    setCampaigns([...campaigns, newCampaign])
  }

  const handleEditEmail = (campaignId, emailContent) => {
    setCampaigns(campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, emailContent } : campaign)))
  }

  return (
    <div className="min-h-screen bg-[#c0bbe5]/10">
      <header className="border-b bg-[#f5f5f5] shadow-sm">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">Email-Marketing</h1>
          <p className="text-sm text-gray-500">Send bulk emails to your customers</p>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">500 credits</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800"
            >
              Create Campaign
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Emails Table */}
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Emails</h2>
              <div className="mt-2 relative">
                <Input
                  placeholder="Search emails..."
                  className="pl-8"
                  value={emailSearchTerm}
                  onChange={(e) => setEmailSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
              </div>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading emails...</div>
              ) : filteredEmails.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No emails found</div>
              ) : (
                filteredEmails.map((email) => (
                  <div key={email.id} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-gray-50">
                    <div>{email.email}</div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-3 py-1 h-auto bg-[#c0bbe5]/20 text-gray-800 hover:bg-[#c0bbe5]/30"
                      >
                        View
                      </Button>
                    </div>
                    <div className="text-gray-500">{email?.businessId?.name}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Campaigns</h2>
              <div className="relative">
                <Input
                  placeholder="Search campaigns..."
                  className="pl-8"
                  value={campaignSearchTerm}
                  onChange={(e) => setCampaignSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
              </div>
            </div>
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{campaign.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Created {campaign.created}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{campaign.customers} customers</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800 border-[#c0bbe5]"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setAddEmailsDialogOpen(true)
                    }}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Emails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#c0bbe5]/10 hover:bg-[#c0bbe5]/20 text-gray-800 border-[#c0bbe5]"
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setEditDialogOpen(true)
                    }}
                  >
                    Edit Email
                  </Button>
                  <Button size="sm" className="bg-[#c0bbe5] hover:bg-[#c0bbe5]/90 text-gray-800">
                    Send
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CreateCampaignDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateCampaign}
      />

      <EditEmailDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={(message) => {
          if (selectedCampaign) {
            handleEditEmail(selectedCampaign.id, message)
          }
          setEditDialogOpen(false)
        }}
        initialContent={selectedCampaign?.emailContent}
      />

      <AddEmailsToCampaignDialog
        open={addEmailsDialogOpen}
        onOpenChange={setAddEmailsDialogOpen}
        campaign={selectedCampaign}
        emails={emails}
        onSubmit={(selectedEmailIds) => {
          if (selectedCampaign) {
            handleAddEmailsToCampaign(selectedCampaign.id, selectedEmailIds)
          }
          setAddEmailsDialogOpen(false)
        }}
      />
    </div>
  )
}

