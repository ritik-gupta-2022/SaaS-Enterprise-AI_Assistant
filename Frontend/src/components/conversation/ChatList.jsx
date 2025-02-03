import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

export function ChatList({ chats, selectedChat, onSelectChat }) {
  if (!chats || chats.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No chats available</div>
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-2">
        {/* {console.log(chats)} */}
        {chats.map((chat) => (
          <Button
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={cn(
              "w-full justify-start px-4 py-2 h-auto",
              selectedChat?._id === chat._id ? "bg-[#c0bbe5]/10" : "hover:bg-muted",
            )}
            variant="ghost"
          >
            <div className="flex items-center w-full">
              <div className="relative mr-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={'https://tse3.mm.bing.net/th?id=OIP.Yuf-aBLWcvTszsO7Vk46tAHaHa&pid=Api&P=0&h=180'} />
                  <AvatarFallback>{chat.email[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                    chat.isOnline ? "bg-green-500" : "bg-gray-300",
                  )}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{chat.email}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {chat.chatHistory[chat.chatHistory.length - 1]?.content}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {format(chat.chatHistory[chat.chatHistory.length - 1]?.timestamp, "h:mm a")}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

