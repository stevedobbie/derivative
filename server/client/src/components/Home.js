import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Center, Flex } from '@chakra-ui/react'

const Home = () => {

  const [ drinks, setDrinks ] = useState([])
  const [ maxBids, setMaxBids ] = useState([])
  const [ minOffers, setMinOffers ] = useState([])
  
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
  const aggregateBids = (array, keys) => {
    return array.reduce((acc, item) => {
      // find the matching index for the item (e.g. offer_to_buy or offer_to_sell price)
      let index = acc.findIndex(index => keys.every(key => index[key] === item[key]))
      // if no matching index then add item to array, otherwise aggregate the price 
      index === -1 ? acc.push(item) : acc[index].number_units += item.number_units
      return acc
    },[])
  } 

  // need to add units into the schema

  // // test aggregate function
  // let array = [
  //   { drink: 1, offer_to_buy: 15 },
  //   { drink: 2, offer_to_buy: 30 },
  //   { drink: 2, offer_to_buy: 20 },
  //   { drink: 1, offer_to_buy: 15 },
  //   { drink: 1, offer_to_buy: 5 }]
  
  // console.log(aggregateBids(array, ["drink", "offer_to_buy"]))

  // Filter and sort to find max bid and offer for each drink
  useEffect(() => {
    if(drinks.length) {
      
      // generate an array of bid objects
      const bidArray = drinks.map((drink) => {
        const { bids } = drink
        return bids
      })
      // generates an array of offer objects
      const offerArray = drinks.map((drink) => {
        const { measures } = drink
        return measures
      })
      
      // aggregate duplicate bids
      const aggregateBidArray = []
      const aggregateOfferArray = []
      for (let i = 0; i < bidArray.length; i++) {
        aggregateBidArray.push(aggregateBids(bidArray[i], ["drink", "offer_to_buy"]))
        aggregateOfferArray.push(aggregateBids(offerArray[i], ["drink", "offer_to_sell"]))
      }
      console.log(aggregateOfferArray)

      // iterate through the bid array to find the highest priced bid and set that in state
      const maxBidArray = aggregateBidArray.map((drink) => {
        return drink.reduce((acc, bid) => acc.offer_to_buy > bid.offer_to_buy ? acc : bid)
      })
      setMaxBids(maxBidArray)
      console.log(maxBidArray)
      
      // iterate through the offer array to find the lowest priced offer to sell and set that in state
      const minOfferArray = aggregateOfferArray.map((drink) => {
        return drink.reduce((acc, offer) => acc.offer_to_sell < offer.offer_to_sell ? acc : offer)
      })
      setMinOffers(minOfferArray)
      console.log(minOfferArray)
      

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
      <div id='hero-bar-container'>
        <div id='hero-bar'></div>
      </div>
      <div id='hero-bar-top'></div>
      
    </div>
  )

}

export default Home