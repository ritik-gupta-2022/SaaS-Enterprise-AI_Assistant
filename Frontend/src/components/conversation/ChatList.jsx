import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatList({ chats, selectedChat, onSelectChat }) {
  if (!chats || chats.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">No chats available</div>
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={cn(
                "w-full justify-start px-4 py-2 h-auto",
                selectedChat?.id === chat.id ? "bg-[#c0bbe5]/10" : "hover:bg-muted",
              )}
              variant="ghost"
            >
              <div className="flex items-center w-full">
                <div className="relative mr-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.user.avatar} />
                    <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                      chat.user.status === "online" ? "bg-green-500" : "bg-gray-300",
                    )}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{chat.user.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {chat.messages[chat.messages.length - 1]?.content}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

