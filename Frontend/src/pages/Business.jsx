import { NavBar } from "../components/Business/NavBar.jsx"
import { DomainSettings } from "../components/Business/Domain-settings.jsx"
import { ChatbotSettings } from "../components/Business/Chatbot-settings.jsx"
import { BotTraining } from "../components/Business/Bot-training.jsx"

export default function Business({businessid}) {
  return (
      <main className=" overflow-scroll ">
        <NavBar businessid={businessid} />
        <div className="max-w-7x px-4 sm:px-6 lg:px-8 pt-20">
          <div className="space-y-8">
            <ChatbotSettings businessid={businessid}/>
            <DomainSettings businessid={businessid}/>
            <BotTraining businessid={businessid}/>
          </div>
        </div>
      </main>
  )
}
