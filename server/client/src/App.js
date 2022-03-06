import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteNavBar from './components/SiteNavBar'
import { ChakraProvider } from '@chakra-ui/react'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

function App() {

  return (
    <>
      <ChakraProvider>
        <BrowserRouter>
          <SiteNavBar />
          <Routes>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            {/* To be added */}
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
