import { useState } from "react";
import { Player } from "./types/types";

export const usePlayers = () => {

  const [ players, setPlayers ] = useState([] as Player[]);
  
 return {
   players : players,
   setPlayers : setPlayers
 };
}

const BE_IP = process.env.REACT_APP_BE_IP || "localhost:5000";

const BE_PROTOCOL = process.env.REACT_APP_BE_PROTOCOL || 'http'

const BE_WS_PROTOCOL = process.env.REACT_APP_BE_WS_PROTOCOL || 'ws'

export const BE_URL = BE_PROTOCOL+"://"+BE_IP;

export const BE_WS_URL = BE_WS_PROTOCOL+"://"+BE_IP+":8999";