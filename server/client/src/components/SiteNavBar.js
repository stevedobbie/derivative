import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Text, Stack, Flex, Button, IconButton } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { AiOutlineCloseSquare, AiOutlineMenu } from 'react-icons/ai'



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
      <Flex>
        <Flex position="fixed" top="1rem" left="1rem" align="center">
          <Text>
            Logo
          </Text>
        </Flex>
        <Flex position="fixed" top="1rem" right="1rem" align="center">
          {/* Desktop */}
          
          <Flex
            display={['none', 'none', 'flex','flex']}
          >
            <Link to='profile'>
              <Button as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                My profile
              </Button>
            </Link>
            <Link to='logout'>
              <Button as="a" variant="ghost" aria-label="Home" my={5} w="100%">
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
              <Button as="a" variant="ghost" aria-label="Home" my={5} w="100%">
                My profile
              </Button>
            </Link>
            <Link to='logout'>
              <Button as="a" variant="ghost" aria-label="Home" my={5} w="100%">
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