import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { MainView } from './components/MainView'
import { useEffect, useState } from 'react'
import { LoginComponent } from './components/LoginComponent'
import { API } from './api/api'

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const isLoggedIn = await API.isUserLoggedIn()
      setIsUserLoggedIn(isLoggedIn)
    }

    fetchUserData()
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/">{isUserLoggedIn ? <MainView></MainView> : <LoginComponent />}</Route>
      </Switch>
    </Router>
  )
}

export default App
