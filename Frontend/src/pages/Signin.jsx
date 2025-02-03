import React, { useState } from 'react'
import Rightinup from '../components/shared/Rightinup'
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { FRONTEND_URL } from '../constant'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice'

const Signin = () => {
  const {loading , error} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill out all fields');
      return dispatch(signInFailure('Please fill out all fields'));
    }

    try {

      dispatch(signInStart);

      const response = await axios.post(`${FRONTEND_URL}/api/auth/signin`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log(response);
  
      if (response.status === 200) {
        toast.success('Signin successful!'); // Add success toast
        dispatch(signInSuccess(response.data));
        navigate('/dashboard'); 
      }
      else{
        toast.error(response.message);
        dispatch(signInFailure(response.message));
      }
    } catch (error) {
      dispatch(signInFailure(error.response.data));
      console.log(error.response.data);
      toast.error('Signup failed. Please try again.'); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="m-auto w-full md:w-[40vw] p-4 border-r-4 border-grey-500">
        <form onSubmit={handleSubmit} className="bg-white p-6 m-9 md:p-11 rounded">
          <h1 className="text-gravel md:text-4xl font-bold mb-5">Sign in
            <p className=" text-sm text-left text-gray-500">
              Don't have an account? <p href="#" onClick={()=>navigate("/signup")} className="text-[#7E75B8] underline inline cursor-pointer">Sign up</p>
            </p>
          </h1>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7E75B8]"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#7E75B8]"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="bg-[#7E75B8] hover:bg-[#6e66a1] text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign In
          </Button>
        </form>
      </div>
      <div className="bg-gray-200 w-full h-[100vh] md:w-[70vw] flex items-center justify-center p-4 md:p-0">
        <Rightinup />
      </div>
      <ToastContainer/>
    </div>
  )
}

export default Signin