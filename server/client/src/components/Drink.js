import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
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
  const [ toggle, setToggle ] = useState(0)
  const [ toggleTwo, setToggleTwo ] = useState(0)
  
  const [ tradeError, setTradeError ] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate = useNavigate()

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
    
  }

  // call API on change to toggle - toggle changes after we put/post info to database
  useEffect(() => {
    toggle === 1 && getData()
    setToggle(0)
  }, [toggle])

  // call API on page load
  useEffect(() => {
    getData()
  }, [])

  // redirect to login if user is not logged in 
  useEffect(() => {
    userAuthenticated() === false && navigate('/login')
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
      setTradeMsg(`Complete buy trade at best price: ??${top3Offers[0].offer_to_sell}`)
    }
    if(e.currentTarget.value <= top3Bids[2].offer_to_buy && e.currentTarget.name === 'sell'){
      setTradeMsg(`Complete sell trade at best price: ??${top3Bids[2].offer_to_buy}`)
    }
    
    const filteredMeasures = profile[0].measures.filter(measure => measure.drink === parseInt(drinkId))
    // console.log(filteredMeasures.length)
    
    if(filteredMeasures.length === 0 && e.currentTarget.name === 'sell'){
      setTradeError(`You don't have any measures to sell`)
    }
    if(filteredMeasures.length && e.currentTarget.name === 'sell'){
      setTradeError(null)
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
        // console.log(`Complete trade at best price - ??${top3Offers[0].offer_to_sell}`)
        setTradeMsg(`Complete buy trade at best price: ??${top3Offers[0].offer_to_sell}`)
      } 
      if (parseFloat(e) > top3Bids[2].offer_to_buy && tradeInfo[0] === 'sell') {
        // console.log('update offer to sell')
        setTradeMsg('Update offer to sell')
      }
      if (parseFloat(e) <= top3Bids[2].offer_to_buy && tradeInfo[0] === 'sell') {
        // console.log(`Complete trade at best price - ??${top3Bids[2].offer_to_buy}`)
        setTradeMsg(`Complete sell trade at best price: ??${top3Bids[2].offer_to_buy}`)
      }
      const parsedE = parseFloat(e)
      const accBalance = parseFloat(parseFloat(profile[0].account_balance).toFixed(2))
      
      if(parsedE > accBalance && tradeInfo[0] === 'buy'){
        setTradeError(`You don't have enough funds to complete the transaction`)
      }
      if(parsedE <= accBalance && tradeInfo[0] === 'buy'){
        setTradeError(null)
      }

      setPrice(e)
    }
  }


  





  // *** this function submits a new bid (or updates an existing one)
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
            setToggle(1) // toggle to call APIs again - only triggered once PUT has been completed
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
            setToggle(1) // toggle to call APIs again - only triggered once POST has been completed
          } catch (error) {
            console.log(error)
          }
        }
        postBid()
      }
    }
    onClose()
    
  }

  // *** this function updates the offer - a user must have an existing measure
  const updateOffer = () => {
    console.log('I will update an existing offer to sell')
    const priceToUpdate = parseFloat(price)

    // check if user has a measure for this drink
    const existingOffers = profile[0].measures.filter(measure => measure.drink === parseInt(drinkId))
    // if they have an existing measure, update it
    if (existingOffers.length) {
      console.log('I will update an existing offer to sell')
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
            setToggle(1) // toggle to call APIs again - only triggered once PUT has been completed
          } catch (error) {
            console.log(error)
          }
        }
        updateOffer()
      }
      
    } 
    onClose()
  }

  // *** this function completes a buy trade
  const completeBuyTrade = () => {

    // update logged in user profile
    if (userAuthenticated) {
      
      const priceToUpdate = parseFloat(price)
      console.log('price of measure ---->', priceToUpdate, typeof priceToUpdate)
      let orchestration = 0
      
      // update logged in user (buyer)
      const updateLoggedInUser = async () => {
        
        const userToUpdate = profile[0].id

        let parsedBalance = parseFloat(parseFloat(profile[0].account_balance).toFixed(2))
        console.log('buyer old balance --->', parsedBalance, typeof parsedBalance)
        parsedBalance -= priceToUpdate
        const newAccountBalance = parseFloat(parsedBalance.toFixed(2))
        console.log('buyer new balance --->', newAccountBalance, typeof newAccountBalance)
      
        let parsedCost = parseFloat(parseFloat(profile[0].cost_as_buyer).toFixed(2))
        console.log('buyer old cost --->', parsedCost, typeof parsedCost)
        parsedCost += priceToUpdate
        const newCostAsBuyer = parseFloat(parsedCost.toFixed(2))
        console.log('buyer new cost --->', newCostAsBuyer, typeof newCostAsBuyer)

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
          orchestration === 2 ? setToggle(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }

      // update current owner (seller)
      const updateCurrentOwner = async () => {
        
        const userToUpdate = top3Offers[0].owner.id
        
        let parsedBalance = parseFloat(parseFloat(top3Offers[0].owner.account_balance).toFixed(2))
        console.log('seller old balance --->', parsedBalance, typeof parsedBalance)
        parsedBalance += priceToUpdate
        const newAccountBalance = parseFloat(parsedBalance.toFixed(2))
        console.log('seller new balance --->', newAccountBalance, typeof newAccountBalance)

        let parsedIncome = parseFloat(parseFloat(top3Offers[0].owner.income_as_seller).toFixed(2))
        console.log('seller old income --->', parsedIncome, typeof parsedIncome)
        parsedIncome += priceToUpdate
        const newIncomeAsSeller = parseFloat(parsedIncome.toFixed(2))
        console.log('seller old income --->', newIncomeAsSeller, typeof newIncomeAsSeller)

        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const input = {
            account_balance: newAccountBalance,
            income_as_seller: newIncomeAsSeller
          }
          const { data } = await axios.put(`/api/auth/profile/${userToUpdate}/`, input, headers)
          console.log('User has been updated successfully')
          console.log(data)
          orchestration === 2 ? setToggle(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }
      
      // complete exchange to buyer and update offer_to_sell to 99.99
      const exchangeMeasure = async () => {
        const newOwner = profile[0].id
        const newOfferToSell = 99.99
        const measureToUpdate = top3Offers[0].id
        
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
          orchestration === 2 ? setToggle(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }

      updateLoggedInUser()
      updateCurrentOwner()
      exchangeMeasure()
    }

    onClose()
  }

  // *** this funnction completes a sell trade
  const completeSellTrade = () => {

    const priceToUpdate = parseFloat(price)
    let orchestration = 0 // this is to ensure the put requests complete before the delete request is triggered by toggleTwo

    // update logged in user profile (seller)
    if (userAuthenticated) {
      
      const updateLoggedInUser = async () => {
        const userToUpdate = profile[0].id

        console.log('price of drink --->', priceToUpdate, typeof priceToUpdate)
        let parsedBalance = parseFloat(parseFloat(profile[0].account_balance).toFixed(2))
        console.log('seller old balance --->', parsedBalance, typeof parsedBalance)
        parsedBalance += priceToUpdate
        const newAccountBalance = parseFloat(parsedBalance.toFixed(2))
        console.log('seller new balance --->', newAccountBalance, typeof newAccountBalance)

        let parsedIncome = parseFloat(parseFloat(profile[0].income_as_seller).toFixed(2))
        console.log('seller old income --->', parsedIncome, typeof parsedIncome)
        parsedIncome += priceToUpdate
        const newIncomeAsSeller = parseFloat(parsedIncome.toFixed(2))
        console.log('seller new income --->', newIncomeAsSeller, typeof newIncomeAsSeller)

        try {
          const headers = {
            headers: {
              Authorization: `Bearer ${getTokenFromLocalStorage()}`
            }
          }
          const input = {
            account_balance: newAccountBalance,
            income_as_seller: newIncomeAsSeller
          }
          const { data } = await axios.put(`/api/auth/profile/${userToUpdate}/`, input, headers)
          console.log('User has been updated successfully')
          console.log(data)
          orchestration === 2 ? setToggleTwo(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }

      // update current owner (buyer)
      const updateBuyer = async () => {

        const userToUpdate = top3Bids[2].owner.id

        let parsedBalance = parseFloat(parseFloat(top3Bids[2].owner.account_balance).toFixed(2))
        console.log('buyer old balance ---->', parsedBalance, typeof parsedBalance)
        parsedBalance -= priceToUpdate
        const newAccountBalance = parseFloat(parsedBalance.toFixed(2))
        console.log('buyer new balance ---->', newAccountBalance, typeof newAccountBalance)

        let parsedCost = parseFloat(parseFloat(top3Bids[2].owner.cost_as_buyer).toFixed(2))
        console.log('buyer old cost ---->', parsedCost, typeof parsedCost)
        parsedCost += priceToUpdate
        const newCostAsBuyer = parseFloat(parsedCost.toFixed(2))
        console.log('buyer new cost ---->', newCostAsBuyer, typeof newCostAsBuyer)

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
          orchestration === 2 ? setToggleTwo(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }

      // complete exchange from seller to buyer
      const exchangeMeasure = async () => {
        const newOwner = top3Bids[2].owner.id
        const newOfferToSell = 99.99
        
        // find a measure from the logged in user to transfer ownership to
        const filteredMeasures = profile[0].measures.filter(measure => measure.drink === parseInt(drinkId))
        const measureToUpdate = filteredMeasures[0].id
        
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
          orchestration === 2 ? setToggleTwo(1) : orchestration += 1
        } catch (error) {
          console.log(error)
        }
      }
      updateLoggedInUser()
      updateBuyer()
      exchangeMeasure()
    }
    onClose()
  }

  // delete bid - awaits on 
  useEffect(() => {
// delete bid
    const deleteBid = async () => {
    
    if (toggleTwo === 1) {
      const bidToDelete = top3Bids[2].id
      
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`
          }
        }
        const { data } = await axios.delete(`/api/bids/${bidToDelete}/`, headers)
        console.log('Bid has been deleted successfully')
        console.log(data)
        setToggle(1)
      } catch (error) {
        console.log(error)
      } 
    } 
  }
  deleteBid()
  setToggleTwo(0)
}, [toggleTwo])



  // trading logic
  const handleSubmit = (e) => {
    // logic to make the trade or submit a bid / offer
    tradeMsg === 'Update or submit new offer to buy' && submitNewBid(e)
    tradeMsg === 'Update offer to sell' && updateOffer(e)
    tradeMsg === `Complete buy trade at best price: ??${top3Offers[0].offer_to_sell}` && !tradeError && completeBuyTrade(e)
    tradeMsg === `Complete sell trade at best price: ??${top3Bids[2].offer_to_buy}` && !tradeError && completeSellTrade(e)
  }

  // this filters for the logged in user's owned measures bids for each drink
  const ownedMeasuresOrBids = (arr) => {
    return arr.filter(item => item.drink === parseInt(drinkId))
  }

  // this function parses strings into 2 digit numbers
  const parseNums = (string) => {
    return parseFloat(parseFloat(string).toFixed(2))
  }
  
  // this function calculates profit for a user object
  const profit = (userObj) => {
    // if ( typeOf userObj.loaded_credit || )
    const userProfit = parseNums((parseNums(userObj.income_as_seller) - parseNums(userObj.cost_as_buyer)))
    return userProfit < 0 ? [`-??${Math.abs(userProfit)}`, 'loss'] : [`??${userProfit}`, 'profit'] 
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
                <Flex justifyContent='flex-end' mr='1rem' my='1.2rem'>{`(${drink[0].bids.length}) Sell`}</Flex>
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
                            {`${number_units} ${pluraliseMeasureNames(top3Offers[0].measure_unit_name, number_units)}`}
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
                <Flex justifyContent='flex-start' my='1.2rem' ml='0.8rem'>{`Buy (${drink[0].measures.length})`}</Flex>
                  <Flex flexDirection='row'>
                  {top3Offers &&
                  top3Offers.map((offer, index) => {
                    const { id, offer_to_sell, number_units, measure_unit_name } = offer
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
                            {`${number_units} ${pluraliseMeasureNames(measure_unit_name, number_units)}`}
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
                    <span className='balance-figure'>{`??${profile[0].account_balance}`}</span>
                  </Flex>
                </Box>
                <Box id='profit-name' className='user-info'>
                  <Flex flexDirection='column' alignItems='center'>
                    <span className='balance-text'>Profit</span>
                    {profit(profile[0])[1] === 'loss' ?
                      <span className='balance-figure' id='loss'>{profit(profile[0])[0]}</span>
                    :
                      <span className='balance-figure' id='profit'>{profit(profile[0])[0]}</span>
                    }
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
                <span id='drink-text'> {drink[0].name}...</span>
              </DrawerHeader>
              <Accordion allowToggle ml={2}>
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
                          <Box fontSize='1.1em' color='orange.500' fontWeight='bold'>{`??${offer_to_sell}`}</Box>
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
                          <Box fontSize='1.1em' color='orange.500' fontWeight='bold'>{`??${offer_to_buy}`}</Box>
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
                {tradeError && tradeInfo[0] == 'sell' &&
                    <span id='trade-error'>{tradeError}</span>
                }
              </Flex>
              <Divider mt={5} />
              <Flex justifyContent='flex-end'>
                <Button variant='outline' mt={5} mr={3} onClick={(() => {onClose(), setTradeError(null)})}>
                  Cancel
                </Button>
                {tradeError ?
                <Button colorScheme='purple' mt={5} onClick={handleSubmit} isDisabled>
                  Submit
                </Button>
                :
                <Button colorScheme='purple' mt={5} onClick={handleSubmit}>
                  Submit
                </Button>
                }
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