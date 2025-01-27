
// Modified Sidebar.jsx
import { LayoutGrid, Plus, MessageCircle, Settings, Calendar, Mail, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import SparklesText from '../ui/sparkles-text'
// import { SidebarConfig } from './SidebarConfig'

const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', id: 'overview' },
    { icon: MessageCircle, label: 'Conversations', id: 'conversations' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: Calendar, label: 'Appointments', id: 'appointments' },
    { icon: Mail, label: 'Email Marketing', id: 'email' },
    { icon: Plus, label: 'Add Business', id: 'add-business' },
]

export function Sidebar({ onNavigation, active }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
   
    const SidebarConfig = {
        colors: {
            expanded: 'bg-[#f5f5f5]',
            collapsed: 'bg-[#f5f5f5]',
            hover: 'hover:bg-[#c0bbe5]',
            activeItem: 'bg-[#c0bbe5]',
        },
        sizes: {
            expanded: 'w-60',
            collapsed: 'w-20',
        }
    }
    const { colors, sizes } = SidebarConfig
    

    return (
        <div className={`${isCollapsed ? sizes.collapsed : sizes.expanded} ${isCollapsed ? colors.collapsed : colors.expanded} min-h-screen text-white p-4 transition-all duration-300 relative border-1 border border-black/20`}>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-4 bg-[#c0bbe5] text-black rounded-full p-1 hover:bg-bg-[#7E75B8]"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className={`flex items-center gap-2 mb-8 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <img src={'/assests/logo.png'} width={'35px'} alt="Logo" className="cursor-pointer" />
                {!isCollapsed && <SparklesText text="BizKit" />}
            </div>

            <nav className="space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigation(item.id)}
                        className={`flex items-center gap-3 px-2 py-2 w-full rounded-lg ${colors.hover} transition-colors ${active === item.id ? colors.activeItem : ''} ${isCollapsed ? 'justify-center text-black' : 'text-black'}`}
                    >
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && <span>{item.label}</span>}
                    </button>
                ))}
               
            </nav>


            <div className={`text-black mt-3 border-t border-gray-800 absolute bottom-4 left-2 right-2 px-4`}>
    <button className={`mt-2 mb-0 flex items-center gap-3 px-2 py-2 w-full rounded-lg ${colors.hover} transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
        <LogOut className="w-5 h-5" />
        {!isCollapsed && <span>Sign out</span>}
    </button>
</div>

        </div>
    )
}



// Add this to your imports at the top
