import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { pluraliseMeasureNames } from './utils/pluraliseMeasureNames'
import { 
  Center, 
  Divider,
  Button,
  Flex, 
  Box, 
  CircularProgress, 
  CircularProgressLabel, 
  Container } from '@chakra-ui/react'
import { aggregateBids } from './utils/aggregateBids'


const Drink = () => {

  const { drinkId } = useParams()
  const [ drink, setDrink ] = useState('')
  const [ indDrinkOrderedBids, setIndDrinkOrderedBids ] = useState([])
  const [ indDrinkOrderedOffers, setIndDrinkOrderedOffers ] = useState([])
  const [ top3Bids, setTop3Bids ] = useState([])
  const [ top3Offers, setTop3Offers ] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/drinks/${drinkId}`)
        console.log(data)
        setDrink([data])
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])
  
  useEffect(() => {

    // calculate top3 bids and offers again - better to do again here from the single drink data in case the drink array order changes
    if (drink.length){
      // generate an array of bid objects
      const bidArray = drink.map((indDrink) => {
      const { bids } = indDrink
      return bids
      })
    

      // generates an array of offer objects
      const offerArray = drink.map((indDrink) => {
      const { measures } = indDrink
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
      setIndDrinkOrderedBids(orderedBidArray)
      // reorder the offer array based on lowest priced offer 
      const orderedOfferArray = aggregateOfferArray.map(drink => {
        return drink.sort(({offer_to_sell:a}, {offer_to_sell:b}) => a-b)
      })
      setIndDrinkOrderedOffers(orderedOfferArray)

      // splice arrays to get top three bids 
      const top3Bids = orderedBidArray[0].slice(0,3)
      const top3Offers = orderedOfferArray[0].slice(0,3)
      setTop3Bids(top3Bids.reverse())
      setTop3Offers(top3Offers)
    }

  }, [drink])

  // when user clicks bid or offer button



  return (
    
    <div id='home-container'>
      {drink.length &&
      <>
        <Center>
          <Flex flexDirection='column' mt={10}>
            <div id='hero-drink'>
              <h1>{drink[0].name}</h1>
            </div>
            <div id='spacing-div'></div>
          </Flex>
        </Center>
        <div id='hero-bar-top'>
          <Center>
            <div className='ind-drink-container'>
              <Box 
                id={`img-${drink[0].id}`} 
                className='ind-drink-img' 
                bgImage={`url('${drink[0].image})`}
              >
              </Box>
            </div>
          </Center>
        </div>
        <div id='bar-edge-div'></div>
        <Center>
          <Container id='price-info' maxW='50rem'>
            <Flex justifyContent='space-between'>
              <Flex flexDirection='column' justifyContent='space-evenly'>
                <CircularProgress 
                  className='progress-bar'
                  value={drink[0].total_measures - drink[0].measures_remaining}
                  size='10rem'
                  thickness='15px'
                  color='purple.600'
                >
                  <CircularProgressLabel>
                    <Flex flexDirection='column'>
                      <span>{`${drink[0].total_measures - drink[0].measures_remaining}%`}</span>
                      <span id="progress-label">sold</span>
                    </Flex>
                  </CircularProgressLabel>
                </CircularProgress>
                
                <Flex flexDirection='column' justifyContent='center' alignItems='center' mt={2}>
                    <span >{`${drink[0].measures_remaining} remain`}</span>
                    <span id='progress-footer'>{`(${drink[0].total_measures} total)`}</span>
                </Flex>
              </Flex>
              <Flex flexDirection='column' justifyContent='center'>
                <Flex mb='1rem' className='price-title'>{drink[0].name}</Flex>
                <Divider />
                <Flex justifyContent='flex-end' mr='1.2rem' my='1.2rem'>Sell</Flex>
                  <Flex flexDirection='row'>
                  {top3Bids &&
                  top3Bids.map((bid, index) => {
                    const { id, offer_to_buy, number_units } = bid
                    return (
                      <Button colorScheme='pink' width='5rem' mr={2} key={id} id={`bid-${index}`}>
                        <Flex flexDirection='column'>
                          <div >{offer_to_buy}</div>
                          <div className='number-units'>
                            {/* {`${number_units} ${pluraliseMeasureNames(minOffer.measure_unit_name, maxBid.number_units)}`} */}
                          </div>
                        </Flex>
                      </Button>
                    )})
                  }
                </Flex> 
              </Flex>
              <Flex flexDirection='column' justifyContent='center'>
                <Flex mb='1rem' className='price-title'>Expires...</Flex>
                <Divider />
                <Flex justifyContent='flex-start' my='1.2rem'>Buy</Flex>
                  <Flex flexDirection='row'>
                  {top3Offers &&
                  top3Offers.map((offer, index) => {
                    const { id, offer_to_sell, number_units } = offer
                    return (
                      <Button colorScheme='blue' width='5rem' mr={2} key={id} id={`offer-${index}`}>
                        <Flex flexDirection='column'>
                          <div >{offer_to_sell}</div>
                          <div className='number-units'>
                            {/* {`${number_units} ${pluraliseMeasureNames(minOffer.measure_unit_name, maxBid.number_units)}`} */}
                          </div>
                        </Flex>
                      </Button>
                    )})
                  }
                </Flex> 
              </Flex>

            </Flex>
          </Container>
        </Center>
      </>
    }   
    </div>
  )

}

export default Drink