import { Avatar } from "../ui/avatar"
import { Card } from "../ui/card"

export function ChatPreview({ senderColor,botBgColor, receiverColor, chatbotImage, chatbotName, chatBgColor, textColor }) {
  return (
    <Card className="w-full max-w-[400px] overflow-hidden m-auto" style={{ color: textColor }} >
      <div className="flex items-center gap-3 border-b  p-4" style={{ backgroundColor: botBgColor }}>
        <Avatar className="h-10 w-10">
          <img src={chatbotImage} alt="Sales Rep" />
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{chatbotName}</h3>
          <p className="text-sm text-muted-foreground">SmartRep AI</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-md bg-gray-100 px-3 py-1 text-sm" style={{backgroundColor:senderColor}}>Chat</button>
          <button className="rounded-md bg-gray-100 px-3 py-1 text-sm" style={{backgroundColor:senderColor}}>Help Desk</button>
        </div>
      </div>

      <div className="h-[300px] space-y-4 overflow-y-auto p-4" style={{ backgroundColor: chatBgColor }}>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg px-4 py-2" style={{ backgroundColor: senderColor }}>
            <p className="text-sm" style={{ color: textColor }}>Sure how can I help you today?</p>
            <span className="text-xs text-gray-500">8:30 pm</span>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 shadow-sm" style={{ backgroundColor: receiverColor }}>
            <p className="text-sm" style={{ color: textColor }}>I want this</p>
            <span className="text-xs text-gray-500">8:30 pm</span>
          </div>
        </div>

        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 shadow-sm" style={{ backgroundColor: receiverColor }}>
            <p className="text-sm" style={{ color: textColor }}>I want this</p>
            <span className="text-xs text-gray-500">8:30 pm</span>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg px-4 py-2" style={{ backgroundColor: senderColor }}>
            <p className="text-sm" style={{ color: textColor }}>Sure how can I help you today?</p>
            <span className="text-xs text-gray-500">8:30 pm</span>
          </div>
        </div>
      </div>

      <div className="border-t  p-4" style={{ backgroundColor: botBgColor }}>
        <div className="relative">
          <input
            type="text"
            placeholder="Type your message"
            className="w-full rounded-lg border bg-gray-50 p-2 pr-10 text-sm"
          />
          <button style={{backgroundColor:senderColor}} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 p-1.5 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400">Powered by BizKit </span>
        </div>
      </div>
    </Card>
  )
}

