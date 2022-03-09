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
  Container,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper, 
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon, 
  Tag,
  Spacer
} from '@chakra-ui/react'
import { aggregateBids } from './utils/aggregateBids'
import { parseDate } from './utils/parseDate'
import { getTokenFromLocalStorage, userAuthenticated } from './utils/userAuthenticated'


const Drink = () => {

  const { drinkId } = useParams()
  
  const [ drink, setDrink ] = useState('')
  const [ indDrinkOrderedBids, setIndDrinkOrderedBids ] = useState([])
  const [ indDrinkOrderedOffers, setIndDrinkOrderedOffers ] = useState([])
  const [ top3Bids, setTop3Bids ] = useState([])
  const [ top3Offers, setTop3Offers ] = useState([])
  const [ profile, setProfile ] = useState([])
  const [ tradeInfo, setTradeInfo ] = useState([])
  const [ tradeMsg, setTradeMsg ] = useState('')
  const [ price, setPrice ] = useState('')
  const [ toggle, setToggle ] = useState(true)
  
  const { isOpen, onOpen, onClose } = useDisclosure()

  const getData = () => {
    const getDrinkData = async () => {
      try {
        const { data } = await axios.get(`/api/drinks/${drinkId}`)
        console.log(data)
        setDrink([data])
      } catch (error) {
        console.log(error)
      }
    }
    getDrinkData()
    
    if (userAuthenticated) {
      const getProfile = async () => {
        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const { data } = await axios.get(`/api/auth/profile/`, headers)
          setProfile([data])
        } catch (error) {
          console.log(error)
        }
      }
      getProfile()
    }

    // force re-render (needed to update page after posting trades)
    setToggle(!toggle) // *** DOESN'T WORK
  }

  // call API on page load
  useEffect(() => {
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


  // logic to generate data to pre-populate the drawer
  const handleClick = (e) => {
    const selectedPrice = e.currentTarget.value
    const selectedType = e.currentTarget.name
    setTradeInfo([selectedType, selectedPrice])
    setPrice(e.currentTarget.value)
    if(e.currentTarget.value >= top3Offers[0].offer_to_sell && e.currentTarget.name === 'buy'){
      setTradeMsg(`Complete trade at best price: £${top3Offers[0].offer_to_sell}`)
    }
    if(e.currentTarget.value <= top3Bids[2].offer_to_buy && e.currentTarget.name === 'sell'){
      setTradeMsg(`Complete trade at best price: £${top3Bids[2].offer_to_buy}`)
    }
    
  }

  // logic to provide message on trade type before clicking submit
  const handleChange = (e) => {
    
    if (tradeInfo.length && top3Bids && top3Offers && price) {

      // logic to submit new bid, update offer or complete transaction depending on value of input
      if(parseFloat(e) < top3Offers[0].offer_to_sell && tradeInfo[0] === 'buy') {
        // console.log('submit new offer to buy')
        setTradeMsg('Update or submit new offer to buy')
      }
      if(parseFloat(e) >= top3Offers[0].offer_to_sell && tradeInfo[0] === 'buy') {
        // console.log(`Complete trade at best price - £${top3Offers[0].offer_to_sell}`)
        setTradeMsg(`Complete trade at best price: £${top3Offers[0].offer_to_sell}`)
      } 
      if (parseFloat(e) > top3Bids[2].offer_to_buy && tradeInfo[0] === 'sell') {
        // console.log('update offer to sell')
        setTradeMsg('Update offer to sell')
      }
      if (parseFloat(e) <= top3Bids[2].offer_to_buy && tradeInfo[0] === 'sell') {
        // console.log(`Complete trade at best price - £${top3Bids[2].offer_to_buy}`)
        setTradeMsg(`Complete trade at best price: £${top3Bids[2].offer_to_buy}`)
      }
      setPrice(e)
    }
  }


  





  // this function submits a new bid (or updates an existing one)
  const submitNewBid = (e) => {
    
    console.log('I will update an existing bid or submit a new bid')
    const priceToUpdate = parseFloat(price)

    // check if user has a bid for this drink
    const existingBids = profile[0].bids.filter(bid => bid.drink === parseInt(drinkId))
    // if they have an existing bid, update it
    if (existingBids.length) {
      console.log('I will update an existing bid')
      const bidId = existingBids[0].id
      
      // update bid
      if (userAuthenticated) {
        const updateBid = async () => {
          try {
            const headers = {
              headers: {
                Authorization: `Bearer ${getTokenFromLocalStorage()}`
              }
            }
            const input = {
              offer_to_buy: priceToUpdate
            }
            const { data } = await axios.put(`/api/bids/${bidId}/`, input, headers)
            console.log('Bid has been updated successfully')
            console.log(data)
          } catch (error) {
            console.log(error)
          }
        }
        updateBid()
      }
      
    } 
    
    // if user has no bids, post a new one
    if (!existingBids.length) {
      console.log('I will post a new bid')
      if (userAuthenticated) {
        const postBid = async () => {
          try {
            const headers = {
              headers: {
                Authorization: `Bearer ${getTokenFromLocalStorage()}`
              }
            }
            const input = {
              offer_to_buy: priceToUpdate,
              drink: drinkId
            }
            const { data } = await axios.post(`/api/bids/`, input, headers)
            console.log('Bid has been successfully created')
            console.log(data)
          } catch (error) {
            console.log(error)
          }
        }
        postBid()
      }
    }
    onClose()
    // call APIs again - to retrieve updated profile and drink info
    getData()
    
  }

  // this function updates the offer - a user must have an existing measure
  const updateOffer = () => {
    console.log('I will update an existing offer to sell')
    const priceToUpdate = parseFloat(price)

    // check if user has a measure for this drink
    const existingOffers = profile[0].measures.filter(measure => measure.drink === parseInt(drinkId))
    // if they have an existing bid, update it
    if (existingOffers.length) {
      console.log('I will update an existing bid')
      const measureId = existingOffers[0].id
      
      // update bid
      if (userAuthenticated) {
        const updateOffer = async () => {
          try {
            const headers = {
              headers: {
                Authorization: `Bearer ${getTokenFromLocalStorage()}`
              }
            }
            const input = {
              offer_to_sell: priceToUpdate
            }
            const { data } = await axios.put(`/api/measures/${measureId}/`, input, headers)
            console.log('Offer to sell has been updated successfully')
            console.log(data)
          } catch (error) {
            console.log(error)
          }
        }
        updateOffer()
      }
      
    } 
    onClose()
    // call APIs again - to retrieve updated profile and drink info *** THIS DOESN'T WORK
    getData()
    setProfile([...profile])
  }

  // this function completes a buy trade
  const completeBuyTrade = () => {

    const priceToUpdate = parseFloat(price)

    // update logged in user profile
    if (userAuthenticated && profile.length) {
      const userToUpdate = profile[0].id
      const newAccountBalance = profile[0].account_balance -= priceToUpdate
      const newCostAsBuyer = profile[0].cost_as_buyer += priceToUpdate

      const updateLoggedInUser = async () => {
        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const input = {
            account_balance: newAccountBalance,
            cost_as_buyer: newCostAsBuyer
          }
          const { data } = await axios.put(`/api/auth/profile/${userToUpdate}/`, input, headers)
          console.log('User has been updated successfully')
          console.log(data)
        } catch (error) {
          console.log(error)
        }
      }
      updateLoggedInUser()
    }

    // update current owner of the measure
    if (userAuthenticated && profile.length) {
      const userToUpdate = top3Offers[0].owner.id
      const newAccountBalance = top3Offers[0].owner.account_balance += priceToUpdate
      const newCostAsBuyer = top3Offers[0].owner.income_as_seller += priceToUpdate

      const updateCurrentOwner = async () => {
        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const input = {
            account_balance: newAccountBalance,
            cost_as_buyer: newCostAsBuyer
          }
          const { data } = await axios.put(`/api/auth/profile/${userToUpdate}/`, input, headers)
          console.log('User has been updated successfully')
          console.log(data)
        } catch (error) {
          console.log(error)
        }
      }
      updateCurrentOwner()
    }
    
    // update measure to reflect new owner and set offer_to_sell to 99.99
    if (userAuthenticated) {
      const newOwner = profile[0].id
      const newOfferToSell = 99.99
      const measureToUpdate = top3Offers[0].id

      const updateCurrentOwner = async () => {
        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const input = {
            offer_to_sell: newOfferToSell,
            owner: newOwner
          }
          const { data } = await axios.put(`/api/measures/${measureToUpdate}/`, input, headers)
          console.log('User has been updated successfully')
          console.log(data)
        } catch (error) {
          console.log(error)
        }
      }
      updateCurrentOwner()
    }

    // *** HOW DO WE TRIGGER A RE-RENDER

  }

  // trading logic
  const handleSubmit = (e) => {
    // logic to make the trade or submit a bid / offer
    tradeMsg === 'Update or submit new offer to buy' && submitNewBid(e)
    tradeMsg === 'Update offer to sell' && updateOffer(e)
    tradeMsg === 'Complete trade at best price: £4.95' && completeBuyTrade(e)
  }

  // this filters for the logged in user's owned measures bids for each drink
  const ownedMeasuresOrBids = (arr) => {
    return arr.filter(item => item.drink === parseInt(drinkId))
  }

  

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
                <Flex mb='1rem' className='price-title' flexDirection='row' justifyContent='space-between'>
                  <span id='price-name'>{drink[0].name}</span>
                  <span>({`${drink[0].abv}%`})</span>
                </Flex>
                <Divider />
                <Flex justifyContent='flex-end' mr='1.2rem' my='1.2rem'>Sell</Flex>
                  <Flex flexDirection='row'>
                  {top3Bids &&
                  top3Bids.map((bid, index) => {
                    const { id, offer_to_buy, number_units } = bid
                    return (
                      <Button 
                        colorScheme='pink' 
                        width='5rem' mr={2} 
                        key={id} 
                        id={`bid-${index}`} 
                        onClick={onOpen} 
                        onMouseDown={handleClick}
                        value={offer_to_buy}
                        name='sell'
                      >
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
                <Flex mb='1rem' className='price-title' flexDirection='row' justifyContent='space-between'>
                  <span id='price-name'>Expires</span>
                  <span> 
                    {parseDate(drink[0].expiry_date).days === 0 ?
                      <>
                        {`${parseDate(drink[0].expiry_date).hours} hours, ${parseDate(drink[0].expiry_date).minutes} mins`}
                      </> 
                      : 
                      <>
                        {`${parseDate(drink[0].expiry_date).days} days, ${parseDate(drink[0].expiry_date).hours} hours`}
                      </> 
                    }
                  </span>
                </Flex>
                <Divider />
                <Flex justifyContent='flex-start' my='1.2rem'>Buy</Flex>
                  <Flex flexDirection='row'>
                  {top3Offers &&
                  top3Offers.map((offer, index) => {
                    const { id, offer_to_sell, number_units } = offer
                    return (
                      
                      <Button 
                        colorScheme='blue'
                        width='5rem' 
                        mr={2} 
                        id={`offer-${index}`} 
                        onClick={onOpen} 
                        onMouseDown={handleClick}
                        value={offer_to_sell}
                        key={id}
                        name='buy'
                      >
                        <Flex flexDirection='column'>
                          <div id='offer-price'>{offer_to_sell}</div>
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
        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          size='sm'
          // finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            {profile.length && drink.length &&
            <>
              <DrawerHeader><span id='balance-title'>{profile[0].username}</span>&#39;s balance</DrawerHeader>
              <Flex justifyContent='space-evenly'>
                <Box id='account-balance' className='user-info'>
                  <Flex flexDirection='column' alignItems='center'>
                    <span className='balance-text'>Balance</span>
                    <span className='balance-figure'>{`£${profile[0].account_balance}`}</span>
                  </Flex>
                </Box>
                <Box id='account-measures' className='user-info'>
                  <Flex flexDirection='column' alignItems='center'>
                    <span className='balance-text'>Measures</span>
                    <span className='balance-figure'>{`${profile[0].measures.length}`}</span>
                  </Flex>
                </Box>
                <Box id='account-bids' className='user-info'>
                  <Flex flexDirection='column' alignItems='center'>
                    <span className='balance-text'>Open bids</span>
                    <span className='balance-figure'>{`${profile[0].bids.length}`}</span>
                  </Flex>
                </Box>
              </Flex>
              <DrawerHeader>
                You own the following
                <span id='drink-text'> {drink[0].name}...</span>
              </DrawerHeader>
              <Accordion allowMultiple defaultIndex={[0]} ml={2}>
                <AccordionItem>
                  <AccordionButton bg='gray.100'>
                    <Box flex='1' textAlign='left'>
                      Measures to sell
                    </Box>
                  <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    {ownedMeasuresOrBids(profile[0].measures).map(measure => {
                      const { id, updated_at, offer_to_sell, number_units, measure_unit_name  } = measure
                      const updatedDate = new Date(updated_at)
                      return (
                        <Flex key={id} my={2} mx={1} justifyContent='space-between'>
                          <Box>{number_units} {measure_unit_name}</Box><Spacer />
                          <Tag mr={3} size='sm' colorScheme='gray'>Updated: {updatedDate.getDate()}-{updatedDate.getMonth()+1}-{updatedDate.getFullYear()}</Tag>
                          <Box fontSize='1.1em' color='orange.500' fontWeight='bold'>{`£${offer_to_sell}`}</Box>
                        </Flex>
                      )
                    }
                      )}
                  </AccordionPanel>
                </AccordionItem>
                <AccordionItem mt={5}>
                  <AccordionButton bg='gray.100'>
                    <Box flex='1' textAlign='left'>
                      Bids to buy
                    </Box>
                  <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    {ownedMeasuresOrBids(profile[0].bids).map(bid => {
                      const { id, updated_at, offer_to_buy } = bid
                      const updatedDate = new Date(updated_at)
                      return (
                        <Flex key={id} my={2} mx={1} justifyContent='space-between'>
                          <Box>{drink[0].name}</Box><Spacer />
                          <Tag mr={3} size='sm' colorScheme='gray'>Updated: {updatedDate.getDate()}-{updatedDate.getMonth()+1}-{updatedDate.getFullYear()}</Tag>
                          <Box fontSize='1.1em' color='orange.500' fontWeight='bold'>{`£${offer_to_buy}`}</Box>
                        </Flex>
                      )
                    }
                      )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </>
            }
            <Divider mt={5}/>
            {tradeInfo.length && tradeInfo[0] === 'sell' ? 
            <DrawerHeader>Submit your <span id='trade-type-sell'>{tradeInfo[0]}</span> trade</DrawerHeader>
            :
            <DrawerHeader>Submit your <span id='trade-type-buy'>{tradeInfo[0]}</span> trade</DrawerHeader>
            }
            <DrawerBody>
              <Flex flexDirection='column' justifyContent='space-between'>
                <Flex id='price-input' alignItems='center' justifyContent='space-between'>
                  {drink.length &&
                    <Box>{drink[0].name}</Box>
                  }
                  {tradeInfo.length &&
                  <NumberInput 
                    defaultValue={tradeInfo[1]} 
                    min={0.01} 
                    max={99.99} 
                    precision={2}
                    clampValueOnBlur={false}
                    step={0.01}
                    onChange={handleChange}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  }
                </Flex>
                <Flex justifyContent='space-between' mt={5}>
                  <span>Trade type</span>
                  {tradeMsg &&
                    <span>{tradeMsg}</span>
                  }
                </Flex>
              </Flex>
              <Divider mt={5} />
              <Flex justifyContent='flex-end'>
                <Button variant='outline' mt={5} mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='purple' mt={5} onClick={handleSubmit}>
                  Submit
                </Button>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    }   
    </div>
  )

}

export default Drink