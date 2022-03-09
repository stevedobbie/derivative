import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import SiteNavBar from './components/SiteNavBar'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './components/Home'
import Drink from './components/Drink'

function App() {

  const [ appendedDrinks, setAppendedDrinks ] = useState([])
  const [ orderedBids, setOrderedBids ] = useState([])
  const [ orderedOffers, setOrderedOffers ] = useState([])

  return (
    <>
      <ChakraProvider>
        <BrowserRouter>
          <SiteNavBar />
          <Routes>
          <Route path='/' element={<Home 
              appendedDrinks={appendedDrinks} 
              setAppendedDrinks={setAppendedDrinks}
              orderedBids={orderedBids}
              setOrderedBids={setOrderedBids}
              orderedOffers={orderedOffers}
              setOrderedOffers={setOrderedOffers}
              />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='drinks/:drinkId' element={<Drink 
              // appendedDrinks={appendedDrinks} 
              // orderedBids={orderedBids}
              // orderedOffers={orderedOffers}
              />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </>
  )
}

export default App
