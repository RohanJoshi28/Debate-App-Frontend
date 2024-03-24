import React, { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import { useGoogleLogin } from "@react-oauth/google";
import { Navigate } from "react-router-dom";
import "./Auth.css";
import useAuth from '../hooks/useAuth';

async function getUserInfo(codeResponse) {
  var response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: codeResponse.code }),
  });

  return await response.json(); // Parse response as JSON
}

export default function Auth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [failedLogin, setFailedLogin] = useState(false);
  const { setAuth } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setFailedLogin(false);
      var loginDetails = await getUserInfo(codeResponse);
      if (loginDetails.user != null) {
        setLoggedIn(true);
        setAuth({ loggedin: true, role: loginDetails.role }); // Set role in context
      } else {
        // User not authenticated
        setFailedLogin(true);
      }
    },
  });

  const handleLogout = async () => {
    var response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setLoggedIn(false);
  };

  if (!loggedIn && failedLogin) {
    return (
      <>
        <button type="button" class="google-sign-in-button" onClick={() => googleLogin()}>
          Sign in with Google
        </button>
        <p class="failed">Error: You are not a registered tournament administrator!</p>
      </>
    );
  } else if (!loggedIn && !failedLogin) {
    return (
      <>
        <button type="button" class="google-sign-in-button" onClick={() => googleLogin()}>
          Sign in with Google
        </button>
      </>
    );
  } else {
    return <Navigate to="/dashboard" />;
  }
}
