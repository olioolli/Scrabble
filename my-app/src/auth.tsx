// Hook (use-auth.js)
import axios from "axios";
import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "react-toastify";
import { BE_URL } from "./state";

const authContext = createContext<AuthContext>({ user: null, login: (a: string, b:string)=>false, logout : () => false});
// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

export type AuthContext = {
    user : string | null;
    login : (username : string, password: string) => boolean;
    logout : () => boolean;
}

// Provider hook that creates auth object and handles state
function useProvideAuth() : AuthContext {

  const [user, setUser] = useState(null);
  
  const login = (username, password) => {
    
    axios.post(BE_URL+"/login",{
        username: username,
        password: password
    }
    ).then((response) => {

        if( response.status == 200 ) {
            setUser(username);
            return true;
        }
        else {
            toast("Login failed!", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                });
            setUser(null);
        }
    }).catch( (err) => {
        toast("Login failed!", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            });
        setUser(null);
    })

    return false;
  };

  const logout = () => {

    setUser(null);
    return true;
  };
  
  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {

    axios.get(`${BE_URL}/isLoggedIn?username=${user}`).then( (resp) => {
        if( resp.data )
            setUser(user);
        else
            setUser(null);
    });
  }, []);
  // Return the user object and auth methods
  return {
    user,
    login,
    logout,
  };
}