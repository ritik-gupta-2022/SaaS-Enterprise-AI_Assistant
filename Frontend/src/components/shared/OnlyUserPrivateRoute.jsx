import {useSelector } from 'react-redux'
import { Outlet , Navigate} from 'react-router-dom'
// import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';


function OnlyUserPrivateRoute() {

    const {currentUser}=useSelector(state=>state.user)
    return (  currentUser ? <Outlet/> :  <Navigate to='/signin'/> 

  )
}

export default OnlyUserPrivateRoute