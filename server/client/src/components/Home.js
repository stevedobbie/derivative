import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Center, 
  Flex, 
  Popover, 
  PopoverArrow, 
  PopoverContent, 
  PopoverHeader, 
  PopoverTrigger, 
  Portal, 
  PopoverCloseButton, 
  PopoverBody,
  Button,
  PopoverFooter,
  Text
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { parseDate } from './utils/parseDate'

const Home = () => {

  const [ drinks, setDrinks ] = useState([])
  const [ orderedBids, setOrderedBids ] = useState([])
  const [ orderedOffers, setOrderedOffers ] = useState([])
  const [ appendedDrinks, setAppendedDrinks ] = useState([])
  
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

      // reorder the bid array based on highest priced bid 
      const orderedBidArray = aggregateBidArray.map(drink => {
        return drink.sort(({offer_to_buy:a}, {offer_to_buy:b}) => b-a)
      })
      setOrderedBids(orderedBidArray)
      // reorder the offer array based on lowest priced offer 
      const orderedOfferArray = aggregateOfferArray.map(drink => {
        return drink.sort(({offer_to_sell:a}, {offer_to_sell:b}) => a-b)
      })
      setOrderedOffers(orderedOfferArray)

      // create object arrays for max bid and min offer
      const maxBid = orderedBidArray.map(item => {
        return {'maxBid': item[0]}
      })
      const minOffer = orderedOfferArray.map(item => {
        return {'minOffer': item[0]}
      })
      
      // add max bids and min offer to drink object arrays so this can be rendered on page
      const appDrinksArr = []
      for(let i=0; i<drinks.length; i++){
        appDrinksArr.push({
          ...drinks[i],
          ...maxBid[i],
          ...minOffer[i]
        })
      }
      setAppendedDrinks(appDrinksArr)
      console.log(parseDate(drinks[0].expiry_date))
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
      <div id='hero-bar-top'>
        <Center>
          <Flex className='drink-container'>
            
            {appendedDrinks &&
              appendedDrinks.map(drink => {
                const { id, measures, name, abv, image, measures_sold, expiry_date, maxBid, minOffer } = drink
                  return (
                    <Popover key={id}>
                      <PopoverTrigger
                        className='main-drinks'
                        to={`/drinks/${id}`}
                      >
                        <div className='drink-img-container'>
                          <img id={`img-${id}`} className='drink-img' src={image}/>
                        </div>
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent maxW="300px">
                          <PopoverArrow />
                          <PopoverHeader>
                            <span className='drink-name'>{name}</span>
                          </PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Center>
                              <Text width='5rem' textAlign='center' mr={5}>Sell</Text>
                              <Text width='5rem' textAlign='center' ml={5}>Buy</Text>
                            </Center>
                            <Center>
                              <Button colorScheme='pink' width='5rem' mr={5}>
                                {maxBid.offer_to_buy}
                              </Button>
                              <Button colorScheme='blue' width='5rem' ml={5}>
                                {minOffer.offer_to_sell}
                              </Button>
                            </Center>
                          </PopoverBody>
                          <PopoverFooter>
                            {parseDate(expiry_date).days === 0 ?
                            <>
                              Expires: {`${parseDate(expiry_date).hours} hours, ${parseDate(expiry_date).minutes} mins`}
                            </> 
                            : 
                            <>
                              Expires: {`${parseDate(expiry_date).days} days, ${parseDate(expiry_date).hours} hours`}
                            </> 
                            }
                          </PopoverFooter>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  )
                })
              }
            
            
          </Flex>
        </Center>
      </div>
    </div>
  )

}

export default Home