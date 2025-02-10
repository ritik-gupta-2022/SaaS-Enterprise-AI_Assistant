import { LayoutGrid, Plus, MessageCircle, Settings, Calendar, Mail, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SparklesText from '../ui/sparkles-text'
import { getAllBusiness } from '../../redux/businessSlice'
import { FRONTEND_URL } from '../../constant'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../redux/userSlice'
import { toast, ToastContainer } from 'react-toastify'

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

export function Sidebar({ onNavigation, active }) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [navItems, setNavItems] = useState([
        { icon: LayoutGrid, label: 'Dashboard', id: 'overview' },
        { icon: MessageCircle, label: 'Conversations', id: 'conversations' },
        { icon: Settings, label: 'Settings', id: 'settings' },
        { icon: Calendar, label: 'Appointments', id: 'appointments' },
        { icon: Mail, label: 'Email Marketing', id: 'email' },
        { icon: Plus, label: 'Add Business', id: 'add-business' },
    ])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const businesses = useSelector((state) => state.business.businesses)

    useEffect(() => {
        dispatch(getAllBusiness())
    }, [dispatch])

    const { colors, sizes } = SidebarConfig
    useEffect(()=>{
        dispatch
    },[])

    const handleLogout = async () => {
        // console.log("Logout clicked");
        try {
            const response = await fetch(`${FRONTEND_URL}/api/auth/signout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
          if (!response.ok) {
            throw new Error('Failed to logout');
          }
          dispatch(logoutUser());
          toast.success('Logged out successfully');
          navigate('/signin');
        } catch (error) {
            
          console.log('Error during logout:', error);
        }
    };

    return (
        <div className={`${isCollapsed ? sizes.collapsed : sizes.expanded} ${isCollapsed ? colors.collapsed : colors.expanded} h-[100vh] text-white p-4 transition-all duration-300 relative border-1 border border-black/20`}>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 z-50 top-4 bg-[#c0bbe5] text-black rounded-full p-1 hover:bg-bg-[#7E75B8]"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className={`flex items-center gap-2 mb-8 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
                <img src={'/assests/logo.png'} width={'35px'} alt="Logo" className="cursor-pointer" />
                {!isCollapsed && <SparklesText text="BizKit" />}
            </div>
            <style>
                {`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
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

            <div className="mt-4 bg-white rounded-lg p-2">
                <nav className="space-y-1 overflow-y-scroll h-48">
                    {businesses.length > 0 ? (
                        businesses.map((business,index) => (
                            <button
                                key={index}
                                onClick={() => onNavigation(business._id)}
                                className={`flex items-center gap-3 px-2 py-2 w-full rounded-lg ${colors.hover} transition-colors ${isCollapsed ? 'justify-center text-black rounded-full' : 'text-black'}`}
                            >
                                <span className="w-5 h-5">{business.name[0]}</span>
                                {!isCollapsed && <span>{business.name}</span>}
                            </button>
                        ))
                    ) : (
                        <>
                           
                            {!isCollapsed && <span className='text-black'> No Business</span>}
                        </>
                    )}
                </nav>
            </div>

            <div className={`text-black mt-3 border-t border-gray-800 absolute bottom-4 left-2 right-2 px-4`}>
                <button onClick={handleLogout} className={`mt-2 mb-0 flex items-center gap-3 px-2 py-2 w-full rounded-lg ${colors.hover} transition-colors ${isCollapsed ? 'justify-center' : ''}`} >
                    <LogOut className="w-5 h-5" />
                    {!isCollapsed && <span>Sign out</span>}
                </button>
            </div>
        </div>
    )
}

