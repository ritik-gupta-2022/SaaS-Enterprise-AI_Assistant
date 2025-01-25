import {BrowserRouter, Routes , Route} from 'react-router-dom'
import SignIn from './pages/Signin.jsx'
import SignUp from './pages/SignUp.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home.jsx';
import OnlyUserPrivateRoute from './components/shared/OnlyUserPrivateRoute.jsx';
import Chatbot from './components/shared/Chatbot';
import Appointment from './pages/Appointment.jsx';
import Conversation from './pages/Conversation.jsx';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path='/' element={<Home/>} />
          <Route path='/signin' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/chatbot' element={<Chatbot/>} />
          <Route path='/appointment' element={<Appointment/>} />

          
          <Route path='' element={<OnlyUserPrivateRoute/>}>
            <Route path='/dashboard' element={<Dashboard/>} />
          </Route>

          
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App