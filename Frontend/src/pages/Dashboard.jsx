import {  useEffect, useState } from 'react'
import { Sidebar } from '../components/shared/Sidebar'
import { DashboardOverview } from '../components/dashboard/Overview'
import AddBusiness from '../components/AddBusiness/AddBusiness'
import Conversation from './Conversation'
import { useDispatch } from 'react-redux'
import { FRONTEND_URL } from '../constant'
import { getAllBusiness } from '../redux/businessSlice'


function Dashboard() {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('overview')
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const res = await fetch(`${FRONTEND_URL}/api/business/myBusiness`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          dispatch(getAllBusiness(data));
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBusinessData();
  }, [])
  

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview/>
      case 'conversations':
        return <Conversation/>
      case 'settings':
        return <h2 className="text-2xl font-bold">Settings</h2>
      case 'appointments':
        return <h2 className="text-2xl font-bold">Appointments</h2>
      case 'email':
        return <h2 className="text-2xl font-bold">Email Marketing</h2>
      case 'add-business':
        return <AddBusiness/>
      default:
        return <h2 className="text-2xl font-bold">Dashboard Overview</h2>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigation={setActiveSection} active={activeSection} />
      <main className="flex-1">
        {renderContent()}
      </main>
    </div>
  )
}

export default Dashboard

