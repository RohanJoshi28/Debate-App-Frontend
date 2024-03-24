import { useLocation, Navigate, Outlet} from "react-router-dom"
import axios from 'axios';
import { useState, useEffect } from "react";


async function getProtectedCoach() {
      // return true; //debug
      const response = await fetch("/protected_coach", {
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
  


const ProtectedCoachRoute = () => {

    const location = useLocation();
    const [isAuthorizedResult, setIsAuthorizedResult] = useState(false);
    const [isLoading, setLoading] = useState(true);
   
    getProtectedCoach().then((authorized) => {
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
        return <Navigate to="/dashboard" />
      }
      
    }


    
}

export default ProtectedCoachRoute