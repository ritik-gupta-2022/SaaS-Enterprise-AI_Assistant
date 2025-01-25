import { format } from "date-fns"
import { MoreHorizontal, Reply } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ChatMessage({ message, isCurrentUser }) {
  if (!message || !message.sender) {
    return null // Return null if message or sender is undefined
  }

  return (
    <div className={cn("flex items-end space-x-2 mb-4", isCurrentUser && "justify-end")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col space-y-1 max-w-[70%]", isCurrentUser && "items-end")}>
        <div className="flex items-center space-x-2">
          {!isCurrentUser && <span className="text-sm font-medium">{message.sender.name}</span>}
          <span className="text-xs text-muted-foreground">{format(message.timestamp, "h:mm a")}</span>
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isCurrentUser ? "bg-[#c0bbe5] text-primary-foreground" : "bg-muted",
          )}
        >
          {message.content}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

