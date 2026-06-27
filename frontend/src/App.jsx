import React , { useEffect } from 'react'
import Hero from './features/welcome/Hero'
import Feature from './features/welcome/Feature'
import Thankyou from './features/welcome/Thankyou'
import Welcome from './features/welcome/Welcome'
import { RouterProvider } from 'react-router-dom'
import  { router } from './auth.routes'
import useauth from './features/auth/hooks/useauth'

const App = () => {
    const auth = useauth()
  useEffect(() => {
    auth.handlegetme()
  }, [])
  return (
    <div>
      <RouterProvider router={router} />
     
    </div>
  )
}

export default App
