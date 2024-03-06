import React, { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import { useGoogleLogin } from "@react-oauth/google";
import UserAvatar from "./UserAvatar";
import Dashboard from "../pages/Dashboard";
import { useLocation, Navigate, Outlet} from "react-router-dom"
import "./Auth.css"
import useAuth from '../hooks/useAuth';

async function getUserInfo(codeResponse) {
  var response = await fetch("/login", {

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: codeResponse.code }),
  });

  return await response;
}

async function getProtected() {
  var response = await fetch("/protected", {
    method: "GET",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((msg) => console.log(msg));
}

async function logOut(){
  var response = await fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export default function Auth() {


  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [failedLogin, setFailedLogin] = useState(false);
  const { setAuth } = useAuth();
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setFailedLogin(false);
      var loginDetails = await getUserInfo(codeResponse);
      if (true){
        setLoggedIn(true);
        setAuth({"loggedin":true});
      } else {
        //User not a whitelisted admin
        setFailedLogin(true);
      }

      
    }
  });

  const handleLogout = () => {
    logOut();
    setLoggedIn(false);
  };

  if (!loggedIn && failedLogin){

    return (
      <>
      <button type="button" class="google-sign-in-button" onClick={() => googleLogin()}>
          Sign in with Google
        </button>
        {/* <IconButton
          color="primary"
          aria-label="add to shopping cart"
          onClick={() => googleLogin()}
        >
          <GoogleIcon fontSize="large" />
        </IconButton> */}

        <p class="failed">Error: You are not a registered tournament administrator!</p>
      </>
    )
  } else if (!loggedIn && !failedLogin){
    return (
      <>
        <button type="button" class="google-sign-in-button" onClick={() => googleLogin()}>
          Sign in with Google
        </button>
        {/* <IconButton
          color="primary"
          aria-label="add to shopping cart"
          onClick={() => googleLogin()}
        >
          <GoogleIcon fontSize="large" />
        </IconButton> */}
      </>
    )
  } 
  else {
    return <Navigate to="/dashboard" />
  }
}