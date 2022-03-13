import axios from "axios";
import { toast } from "react-toastify";
import { BE_URL } from "../state";

export const getCurrentPlayerName = (): string => {
    return document.cookie;
}

export const isLoggedIn = () => {
    if( document.cookie === '' )
        return false;

    axios.get(BE_URL+ "/isLoggedIn?username="+document.cookie)
        .then( (response) => {
            if( response.status == 200 ) {
                const data = response.data;
                if(data.isLoggedIn)
                    window.location.replace("game");
            }
            
        })
        .catch((err) => {
            toast("Failed to get login status from BE", {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });
        });
    
    return false;
}

export const login = (username: string) => {

    axios.post(BE_URL + "/login", {
        username: username,
    }
    ).then((response) => {

        if (response.status == 200) {
            document.cookie = username;
            window.location.replace("game");
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
            document.cookie = '';
        }
    }).catch((err) => {
        toast("Login failed!", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
        });
        document.cookie = '';
    });

    return false;
}