import { Bell, User } from "lucide-react"
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"

export function NavBar({businessid}) {
  const {businesses}=useSelector(state=>state.business);
  const business= businesses.find((business) => business._id === businessid);
  return (
    <header className="fixed z-20  top-0  flex h-16 items-center justify-between border-b bg-white px-4 w-[95vw]">
      <div className="flex flex-col ">
        <Link to="/" className="text-xl font-semibold">
          {business?.name}
        </Link>
      
        <p className="text-sm text-muted-foreground">
          Modify domain settings, change chatbot options, enter sales questions and train your bot to do what you want
          it to.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
        </button>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

