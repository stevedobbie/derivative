import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { pluraliseMeasureNames } from './utils/pluraliseMeasureNames'
import { 
  Center, 
  Flex, 
  Box, 
  CircularProgress, 
  CircularProgressLabel, 
  Container } from '@chakra-ui/react'


const Drink = ( { appendedDrinks, orderedBids, orderedOffers } ) => {

  const { drinkId } = useParams()
  const [ drink, setDrink ] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(`/api/drinks/${drinkId}`)
        console.log(data)
        setDrink(data)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])
  
  useEffect(() => {
    // calculate top3 bids and offers here - better to do again here from the single drink data in case the drink array order changes

  })


  return (
    
    <div id='home-container'>
      {drink &&
      <>
        <Center>
          <Flex flexDirection='column' mt={10}>
            <div id='hero-drink'>
              <h1>{drink.name}</h1>
            </div>
            <div id='spacing-div'></div>
          </Flex>
        </Center>
        <div id='hero-bar-top'>
          <Center>
            <div className='ind-drink-container'>
              <Box 
                id={`img-${drink.id}`} 
                className='ind-drink-img' 
                bgImage={`url('${drink.image})`}
              >
              </Box>
            </div>
          </Center>
        </div>
        <div id='bar-edge-div'></div>
        <Center>
          <Container id='price-info' maxW='50rem'>
            <Flex justifyContent='space-evenly'>
              <CircularProgress 
                className='progress-bar'
                value={drink.total_measures - drink.measures_remaining}
                size='12rem'
                thickness='15px'
                color='purple.600'
              >
                <CircularProgressLabel>
                  <Flex flexDirection='column'>
                    <span>{`${drink.total_measures - drink.measures_remaining}%`}</span>
                    <span id="progress-label">sold</span>
                  </Flex>
                </CircularProgressLabel>
              </CircularProgress>
              
              <Flex flexDirection='column' justifyContent='center'>
                <span>{`${drink.measures_remaining} remain`}</span>
                <span>{`(${drink.total_measures} total)`}</span>
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