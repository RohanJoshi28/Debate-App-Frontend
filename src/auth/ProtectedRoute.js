import { useLocation, Navigate, Outlet} from "react-router-dom"
import axios from 'axios';
import { useState, useEffect } from "react";


async function getProtected() {
      const response = await fetch("/protected", {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })

        if (response.status==200){
          return response.ok;
        } else {
          return false;
        }
    
  }
  

const ProtectedRoute = () => {

    const location = useLocation();
    const [isAuthorizedResult, setIsAuthorizedResult] = useState(false);
    const [isLoading, setLoading] = useState(true);
   
    getProtected().then((authorized) => {
      if (authorized) {
        setIsAuthorizedResult(true);
      } 
      setLoading(false);
    })

    if (isLoading){
      return (
        <div>
        </div>
      )
    } else {
      if (isAuthorizedResult){
        return (
          <div>
            <Outlet />
          </div>
        )
      } else {
        return <Navigate to="/" />
      }
      
    }


    
}

export default ProtectedRoute