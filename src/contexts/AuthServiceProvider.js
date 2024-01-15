import { createContext, useState } from "react";

const AuthServiceContext = createContext({});

export const AuthServiceProvider = ({ children }) => {
    
    

    return (
        <AuthServiceContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthServiceContext.Provider>
    )
}

export default AuthServiceContext;