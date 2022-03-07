import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { FormControl, Input, FormLabel, FormHelperText, Container, FormErrorMessage, Button, Center } from '@chakra-ui/react'
import { TriangleUpIcon } from '@chakra-ui/icons'

const Register = () => {

  const navigate = useNavigate()

  const [ formData, setFormData ] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const [ error, setError ] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError({ ...error, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { data } = await axios.post('/api/auth/register/', formData)
      console.log(data)
      navigate('/login')
    } catch (errorMsg) {
      setError(errorMsg.response.data.detail)
    }

  }

  return (
    <>
      <Center className='form-background'>
        <Container m={5} mt={10} className='form-container' p={10}>
          
          <FormControl isRequired isInvalid={error.username}>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input 
              className='form-field' 
              type='username' 
              name='username'
              placeholder='username'
              defaultValue={formData.username}
              onChange={handleChange}
            />
            {error.username !== '' ?
              <FormErrorMessage className='form-error'>
              {error.username} 
              </FormErrorMessage>
              :
              <FormHelperText className='form-helper' color='white'>
                Enter your username
              </FormHelperText>
            } 
          </FormControl>
          
          <FormControl isRequired mt={2} isInvalid={error.email}>
            <FormLabel htmlFor='email'>Email address</FormLabel>
            <Input 
              className='form-field' 
              type='email' 
              name='email'
              placeholder='name@email.com'
              defaultValue={formData.email}
              onChange={handleChange}
            />
            {error.email !== '' ?
              <FormErrorMessage className='form-error'>
              {error.email}
              </FormErrorMessage>
              :
              <FormHelperText className='form-helper' color='white'>
                Enter your email address
              </FormHelperText>
            } 
          </FormControl>
          
          <FormControl isRequired mt={2} isInvalid={error.password}>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input 
              className='form-field' 
              type='password' 
              name='password'
              placeholder='********'
              defaultValue={formData.password}
              onChange={handleChange}
            />
            {error.password !== '' ?
              <FormErrorMessage className='form-error'>
              {error.password} 
              </FormErrorMessage>
              :
              <FormHelperText className='form-helper' color='white'>
                Enter your password
              </FormHelperText>
            } 
          </FormControl>
          
          <FormControl isRequired mt={2} isInvalid={error.password_confirmation}>
            <FormLabel htmlFor='password_confirmation'>Confirm password</FormLabel>
            <Input 
              className='form-field' 
              type='password' 
              name='password_confirmation'
              placeholder='********'
              defaultValue={formData.password_confirmation}
              onChange={handleChange}
            />
            {error.password_confirmation !== '' ?
                <FormErrorMessage className='form-error'>
                  {error.password_confirmation} 
                </FormErrorMessage>
                :
                <FormHelperText className='form-helper' color='white'>
                      Confirm your password
                </FormHelperText>
            } 
          </FormControl>

          <FormControl mt={10} >
            <Center>
              <Button 
              className='submit-button' 
              leftIcon={<TriangleUpIcon />} 
              variant='solid' 
              width='10rem'
              colorScheme='pink'
              onClick={handleSubmit}
              >
                Submit
              </Button>
            </Center>
          </FormControl>
        </Container>
      </Center>
    </>
  )

}

export default Register