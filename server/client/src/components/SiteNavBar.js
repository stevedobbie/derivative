import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Text, Flex, Button, IconButton } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { userAuthenticated } from './utils/userAuthenticated'

const SiteNavBar = () => {
  
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/drinks/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  }, [])

  const [ display, setDisplay ] = useState('none')

  return (
    <>
      
      <Flex id='nav-container' justify='space-between' align="center">
        <Flex className='nav-logo' my={5}> 
            <Text ml={5}>
              Logo
            </Text>
        </Flex>
          
        <Flex align="center">
          {/* Desktop */}
          <Flex
            display={['none', 'none', 'flex','flex']}
            className='nav-links'
          >
            <Link to='profile'>
              <Button className='nav-button' variant="ghost" aria-label="Home" my={5} w="100%">
                My profile
              </Button>
            </Link>
            <Link id='nav-logout' to='logout' mr={10}>
              <Button className='nav-button' variant="ghost" aria-label="Home" my={5} w="100%">
                Logout
              </Button>
            </Link>
          </Flex>
          {/* Mobile */}
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            
            icon={<HamburgerIcon />}
            onClick={() => setDisplay('flex')}
            display={['flex', 'flex', 'none', 'none']}
          />
        </Flex>
        
          {/* Mobile Content */}
        <Flex
          w='100vw'
          display={display}
          bgColor="gray.50"
          zIndex={20}
          h="100vh"
          pos="fixed"
          top="0"
          left="0"
          overflowY="auto"
          flexDir="column"
        >
          <Flex justify="flex-end">
            <IconButton
              mt={2}
              mr={2}
              aria-label="Open Menu"
              size="lg"
              icon={<CloseIcon />}
              onClick={() => setDisplay('none')}
            />
          </Flex>

          <Flex flexDir="column" align="center">
            <Link to='profile'>
              <Button variant="ghost" aria-label="Home" mt={5} w="100%">
                My profile
              </Button>
            </Link>
            <Link to='logout'>
              <Button variant="ghost" aria-label="Home" mt={5} w="100%">
                Logout
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </>
  )


}

export default SiteNavBar