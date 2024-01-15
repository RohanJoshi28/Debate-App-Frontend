import { useEffect } from "react";


export const useAuthService = () => {
    async function logOut(){
        var response = await fetch("/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
    }


}
