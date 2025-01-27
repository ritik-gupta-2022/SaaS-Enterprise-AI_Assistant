import { MoreHorizontal, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { useState } from "react"

export function ChatHeader({ chat }) {
  const [isRealTimeChat, setIsRealTimeChat] = useState(false)
  const [name , setName] = useState(chat.email.split("@")[0]);
  return (
    <div className="flex items-center justify-between p-4 border-b bg-[#c0bbe5]/10">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={'https://tse3.mm.bing.net/th?id=OIP.Yuf-aBLWcvTszsO7Vk46tAHaHa&pid=Api&P=0&h=180'} />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-base text-muted-foreground">{chat.isOnline ? "Active now" : "Offline"}</p>
        </div>
        <div className="flex items-center space-x-2">
            <Switch
              id="real-time-chat"
              checked={isRealTimeChat}
              onCheckedChange={setIsRealTimeChat}
              className="data-[state=checked]:bg-[#c0bbe5]"
            />
            {/* <Label htmlFor="real-time-chat">Real-time Chat</Label> */}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-[#c0bbe5] hover:text-[#c0bbe5]/80 hover:bg-[#c0bbe5]/10">
          <Mail className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-[#c0bbe5] hover:text-[#c0bbe5]/80 hover:bg-[#c0bbe5]/10">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

