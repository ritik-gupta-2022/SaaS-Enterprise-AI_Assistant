import React from 'react'
import Rightinup from '../components/shared/Rightinup'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FRONTEND_URL } from '../constant'

import { ToastContainer, toast } from 'react-toastify';
const SignUp = () => {
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${FRONTEND_URL}/api/auth/signup`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response);
  
      if (response.status === 200) {
        toast.success('Signup successful!'); // Add success toast
        navigate('/'); // Navigate to home page instead of signin
      }
    } catch (error) {
      
      // console.log(error.response.data);
      toast.error('Signup failed. Please try again.'); // Optional: Add error toast
    }
  };
  
  const navigate=useNavigate();
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="m-auto w-full md:w-[40vw] p-4 border-r-4 border-grey-500">
        <form className="bg-white p-6 m-9 md:p-11 rounded " onSubmit={handleSubmit}>
          <h1 className="text-gravel md:text-4xl font-bold mb-5">Sign up

             <p className=" text-sm text-left text-gray-500">
            Don't have an account? <p href="#" className="text-[#7E75B8] underline inline cursor-pointer" onClick={()=>{navigate('/signin')}}>Sign In</p>
          </p>
          </h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <Input
              type="text"
              placeholder="Name"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7E75B8]"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
         
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Email"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7E75B8]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Password"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7E75B8]"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <Button
            variant="outline"
            className="bg-[#7E75B8] hover:bg-[#6e66a1] text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign Up
          </Button>
          
        </form>
      </div>
      <div className="bg-gray-200 w-full h-[100vh] md:w-[70vw] flex items-center justify-center p-4 md:p-0">
        <Rightinup />
      </div>
      <ToastContainer />
    </div>
  )
}

export default SignUp