import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteNavBar from './components/SiteNavBar'
import { ChakraProvider } from '@chakra-ui/react'

function App() {

  return (
    <>
      <ChakraProvider>
        <BrowserRouter>
          <SiteNavBar />
          {/* <Routes> */}
            {/* To be added */}
          {/* </Routes> */}
        </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
