import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"


export function ChatMessage({ message, isCurrentUser,email }) {
  if (!message) {
    return null
  }
  // console.log(email[0].toUpperCase());

  return (
    <div className={cn("flex items-end space-x-2 mb-4", isCurrentUser && "justify-end")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={email[0].toUpperCase()} />
          <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex flex-col space-y-1 max-w-[70%]", isCurrentUser && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isCurrentUser ? "bg-[#c0bbe5] text-primary-foreground" : "bg-muted",
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-muted-foreground">{format(message.timestamp, "h:mm a")}</span>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={"https://img.icons8.com/external-elyra-zulfa-mahendra/2x/external-chat-bot-metaverse-elyra-zulfa-mahendra.png"} />
          <AvatarFallback>{email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

