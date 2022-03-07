import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Center, Flex } from '@chakra-ui/react'

const Home = () => {

  const [ drinks, setDrinks ] = useState([])
  const [ filterBids, setFilterBids ] = useState([])
  
  // Get drink, measure and bid data
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('/api/drinks/')
        console.log(data)
        setDrinks(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  // Function to aggregate bids and offers if they are the same price
  const aggregate = (array, priceKey) => {
    return array.reduce((acc, item) => {
      // find the matching index for the item (e.g. offer_to_buy or offer_to_sell price)
      let index = acc.findIndex(index => priceKey.every(key => index[key] === item[key]))
      // if no matching index then add item to array, otherwise aggregate the price 
      index === -1 ? acc.push(item) : acc[index].priceKey += item.priceKey
      return acc
    },[])
  } 


  // Filter bids and offers
  useEffect(() => {
    if(drinks.length) {
      const bidArray = drinks.map((drink) => {
        const { bids } = drink
        return bids
      })
      console.log(bidArray)
    }
  }, [drinks])




  
  return (
    
    <div id='home-container'>
      
      <Center>
        <Flex flexDirection='column' mt={10}>
          <div id='hero-sign'>
            <Center>
              <h1>Derivative</h1>
            </Center>
          </div>
          
        </Flex>
      </Center>
      <div id='hero-bar'></div>
      <div id='hero-bar-top'></div>
      
    </div>
  )

}

export default Home