import { format } from "date-fns"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ChatMessage({ message, isCurrentUser, email, role }) {
  if (!message) {
    return null
  }
  console.log(role, message)
  
  const isSystem = role === 'system'

  return (
    <div className={cn(
      "flex items-end space-x-2 mb-4", 
      isSystem ? "justify-center" : isCurrentUser && "justify-end"
    )}>
      <div className={cn("flex flex-col space-y-1 max-w-[70%]", isCurrentUser && !isSystem && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isSystem ? "bg-gray-100" : isCurrentUser ? "bg-[#c0bbe5] text-primary-foreground" : "bg-muted",
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground">{format(message.timestamp, "h:mm a")}</span>
      </div>
    </div>
  )
}
