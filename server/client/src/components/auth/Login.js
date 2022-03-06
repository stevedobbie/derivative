import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FormControl, Input, FormLabel, FormHelperText, Container, FormErrorMessage, Button, Center } from '@chakra-ui/react'
import { TriangleUpIcon } from '@chakra-ui/icons'

const Login = () => {

  const navigate = useNavigate()

  const [ formData, setFormData ] = useState({
    email: '',
    password: ''
  })

  const [ error, setError ] = useState('')

  const storeToken = (token) => {
    window.localStorage.setItem('derivative-token', token)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/auth/login/', formData)
      storeToken(data.token)
      navigate('/')
    } catch (error) {
      console.log(error)
      console.log(error.response)
      const { detail } = error.response.data
      console.log(detail)
      setError(detail)
    }
  }

  return (
    <>
      <Container mt={10} className='form-container' p={50}>
        <FormControl isRequired>
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input 
            className='form-field' 
            type='email' 
            name='email'
            placeholder='name@email.com'
            defaultValue={formData.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired mt={5} isInvalid={error}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input 
            className='form-field' 
            type='password' 
            name='password'
            placeholder='********'
            defaultValue={formData.password}
            onChange={handleChange}
          />
          {!error ?
            <FormHelperText className='form-helper'>
              Please enter your user details
            </FormHelperText>
            :
            <FormErrorMessage className='form-error'>
              {error} 
            </FormErrorMessage>
          } 
        </FormControl>
        <FormControl mt={10} >
          <Center>
            <Button 
            className='submit-button' 
            leftIcon={<TriangleUpIcon />} 
            variant='solid' 
            width='30%'
            colorScheme='pink'
            onClick={handleSubmit}
            >
              Submit
            </Button>
          </Center>
        </FormControl>
      </Container>
    </>
  )

}

export default Login