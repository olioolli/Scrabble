import { useState } from "react";
import { Player } from "./types/types";

export const usePlayers = () => {

  const [ players, setPlayers ] = useState(<Player[]>[]);
  
 return {
   players : players,
   setPlayers : setPlayers
 };
}

export const BE_URL = "http://localhost:5000";

export const BE_WS_URL = "ws://localhost:8999";