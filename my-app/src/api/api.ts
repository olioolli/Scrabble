import axios from 'axios'
const BE_IP = process.env.REACT_APP_BE_IP || 'localhost:5000'

const BE_PROTOCOL = process.env.REACT_APP_BE_PROTOCOL || 'http'

export const WS_PORT = '443'

export const BE_URL = BE_PROTOCOL + '://' + BE_IP

export const BE_WS_URL = process.env.REACT_APP_BE_WS_PROTOCOL
  ? process.env.REACT_APP_BE_WS_PROTOCOL + '://' + BE_IP + ':' + WS_PORT
  : 'ws://localhost:' + WS_PORT

const isUserCookieSet = () => document.cookie !== ''

const isUserLoggedIn = () => {
  if (!isUserCookieSet()) {
    return false
  }

  return axios
    .get(BE_URL + '/isLoggedIn?username=' + document.cookie)
    .then((response) => (response.status === 200 ? !!response.data.isLoggedIn : false))
}

export const API = {
  isUserLoggedIn,
}
