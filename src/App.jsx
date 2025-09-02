import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Routes from './Routes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
 <BrowserRouter>
 <Toaster/>
   <Routes/>
 </BrowserRouter>
  )
}

export default App