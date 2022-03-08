import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Box, Text, Flex, Button, IconButton } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { userAuthenticated } from './utils/userAuthenticated'
import logo from '../images/derivative-logo-white.png'

const SiteNavBar = () => {

  const [ display, setDisplay ] = useState('none')

  const navigate = useNavigate()

  const url = window.location.href.split('/') // get page location
  const page = url[url.length - 1]
  console.log(page)

  const handleLogOut = () => {
    localStorage.removeItem('derivative-token')
    navigate('/')
  }

  return (
    <>
      <Flex id='nav-container' justify='space-between' align="center" bg='gray.800'>
        <Flex className='nav-logo' my={2} ml={10}> 
            <Link to='/'>
              <img id='logo-img' src={logo} />
            </Link>
        </Flex>
          
        <Flex align="center">
          {/* Desktop */}
          <Flex
            display={['none', 'none', 'flex','flex']}
            className='nav-links'
          >
            {userAuthenticated() ? 
            <>  
              <Link to='profile'>
                <Button className='nav-button' variant="ghost" aria-label="Home" my={5} w="100%" fontSize='1.25em'>
                  My profile
                </Button>
              </Link>
              <Link className='nav-logout' to='logout' mr={10} onClick={handleLogOut}>
                <Button className='nav-button' variant="ghost" aria-label="Home" my={5} w="100%" fontSize='1.25em'>
                  Logout
                </Button>
              </Link>
            </>
            :
            <>
              {page === 'login' ?
              <>
                <Link className='nav-logout' to='register' mr={10}>
                  <Button className='nav-button' variant="ghost" aria-label="Home" my={5} w="100%" fontSize='1.25em'>
                    Register
                  </Button>
                </Link>
              </>
              :
              <>
                <Link className='nav-logout' to='login' mr={10}>
                  <Button className='nav-button' variant="ghost" aria-label="Login" my={5} w="100%" fontSize='1.25em'>
                    Login
                  </Button>
                </Link>
              </>
            }
          </>
          }  
          </Flex>
          {/* Mobile */}
          <IconButton
            aria-label="Open Menu"
            size="lg"
            mr={2}
            colorScheme='purple'
            icon={<HamburgerIcon />}
            onClick={() => setDisplay('flex')}
            display={['flex', 'flex', 'none', 'none']}
          />
          </Flex>
        
          {/* Mobile Content */}
          <Flex
            w='100vw'
            display={display}
            bgColor="purple.50"
            bgImage="url('https://i.imgur.com/pO1FMqh.jpg')"
            color='black'
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
              my={5}
              mr={2}
              aria-label="Open Menu"
              size="lg"
              icon={<CloseIcon />}
              colorScheme='purple'
              onClick={() => setDisplay('none')}
            />
          </Flex>
          <Flex flexDir="column" align="center">
            {/* Insert info here ---> */}
            {userAuthenticated() ? 
            <>  
              <Link id='nav-profile-mob' to='profile'>
                <Button className='nav-button-mob' variant="solid" aria-label="My profile" mt={5} w="12em" colorScheme='whiteAlpha'>
                  My profile
                </Button>
              </Link>
              <Link id='nav-logout-mob' to='logout' onClick={handleLogOut}>
                <Button className='nav-button-mob' variant="solid" aria-label="Logout" mt={5} w="12em" colorScheme='whiteAlpha'>
                  Logout
                </Button>
              </Link>
            </>
            :
            <>
              {page === 'login' ?
              <>
                <Link id='nav-register-mob' to='register' mr={10}>
                  <Button className='nav-button-mob' variant="solid" aria-label="Register" mt={5} w="12em" colorScheme='whiteAlpha'>
                    Register
                  </Button>
                </Link>
              </>
              :
              <>
                <Link id='nav-login-mob' to='login' mr={10}>
                  <Button className='nav-button-mob' variant="solid" aria-label="Login" mt={5} w="12em" colorScheme='whiteAlpha'>
                    Login
                  </Button>
                </Link>
              </>
            }
          </>
          }  
          {/* Insert info above */}
          </Flex>
        </Flex>
      </Flex>
    </>
  )


}

export default SiteNavBar