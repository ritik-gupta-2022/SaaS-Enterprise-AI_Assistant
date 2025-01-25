import { Phone, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"


export function ChatHeader({ chat }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={chat.user.avatar} />
          <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{chat.user.name}</h2>
          <p className="text-sm text-muted-foreground">{chat.user.status === "online" ? "Active now" : "Offline"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

