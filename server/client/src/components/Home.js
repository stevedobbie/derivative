import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
import { Link, Navigate } from 'react-router-dom'
import { parseDate } from './utils/parseDate'
import { pluraliseMeasureNames } from './utils/pluraliseMeasureNames'
import { aggregateBids } from './utils/aggregateBids'

const Home = ( { appendedDrinks, setAppendedDrinks, orderedBids, setOrderedBids, orderedOffers, setOrderedOffers } ) => {

  const [ drinks, setDrinks ] = useState([])
  
  
  const navigate = useNavigate()

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
    }
  }, [drinks])

  const handleClick = (e) => {
    if (appendedDrinks.length) {
      const drinkid = e.target.className.replace(/\D/g,'')[0]
      navigate(`drinks/${drinkid}`)
      }
      
    }
    
  
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
                const { id, measures, name, abv, image, measures_remaining, expiry_date, maxBid, minOffer } = drink
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
                            <span className='drink-name'>{name}</span> ({abv}%)<br />
                            <span className='measures-remaining'>
                              {`${measures.length} sold 
                              (${measures_remaining} ${pluraliseMeasureNames(measures[0].measure_unit_name, measures_remaining)} left)`}
                            </span>
                          </PopoverHeader>
                          
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Center>
                              <Text width='5rem' textAlign='center' mr={5}>Sell</Text>
                              <Text width='5rem' textAlign='center' ml={5}>Buy</Text>
                            </Center>
                            <Center>
                              <Button colorScheme='pink' width='5rem' mr={5} onClick={handleClick} className={id}>
                                <Flex flexDirection='column' className={id}>
                                  <div className={id}>{maxBid.offer_to_buy}</div>
                                  <div className={`number-units ${id}`}>
                                    {`${maxBid.number_units} ${pluraliseMeasureNames(minOffer.measure_unit_name, maxBid.number_units)}`}
                                  </div>
                                </Flex>
                              </Button>
                              <Button colorScheme='blue' width='5rem' ml={5} onClick={handleClick} className={id}>
                                <Flex flexDirection='column' className={id}>
                                  <div className={id}>{minOffer.offer_to_sell}</div>
                                  <div className={`number-units ${id}`}>
                                    {`${minOffer.number_units} ${pluraliseMeasureNames(minOffer.measure_unit_name, minOffer.number_units)}`}
                                  </div>
                                </Flex>
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
      <div id='bar-edge-div'></div>
    </div>
  )

}

export default Home