import { Box, Button, Flex, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const backgroundYellow = '#fdfce8';
    const green = '#1f574f';
    const accentYellow = '#f6f8b5';
    const pink = '#ee98e0';
    const purple = '#a78dfc';
    const orange = '#f08853';

    const navigate = useNavigate();

  return (
    <Flex>
        <Box
            bg = {backgroundYellow}
            w = '100%'
            minH = '100vh'
        >
            <VStack gap = '4'>
                <Box h = '33%'>
                    <VStack spacing = '4'>
                        <Heading 
                            as = 'h1' 
                            fontSize = {{base: '15vw', xl: '10vw'}}
                            lineHeight = '1em'
                            color = 'black'
                            fontWeight= {{base: 'bold', xl: 'normal'}}
                            fontFamily = 'sans-serif'
                            pt = '30px'
                            pb = '10px'
                        >
                            Ready
                        </Heading>
                        
                        <Heading 
                            as = 'h1' 
                            fontSize = {{base: '15vw', xl: '10vw'}}
                            lineHeight = '1em'
                            fontFamily = "'Gravitas One, serif'"
                            color = {purple}
                            transform = 'scaleY(1.3)'
                            transformOrigin = 'bottom'
                        >
                            to Connect?
                        </Heading>
                    </VStack>
                </Box>
                <Box
                    w = {{base: '95vw', xl: '50vw'}}
                    h = '33vh'
                    bg = {green}
                    borderRadius = '12px'
                    overflow = 'hidden'
                    display = 'flex'
                    alignItems = 'center'
                    justifyContent = 'center'
                    m = {{base: '30px'}}

                >
                    <Text color = {accentYellow} fontFamily = 'sans-serif'>Placeholder Text</Text>
                </Box>
                <Button 
                    bg = 'black'
                    color = 'white'
                    w = {{base: '95vw', xl: '50vw'}}
                    p = '30px'
                    borderRadius = '12px'
                    transition = 'all 0.25s ease-in-out'
                    _hover ={{
                        transform: 'scale(1.02)',
                        bg: accentYellow,
                        color: 'black',
                        shadow: 'md'
                    }}
                    _active = {{
                         bg: accentYellow,
                        color: 'black',
                    }}
                    onClick={() => navigate('/login') }
                >
                    Log In
                </Button>
                <Button
                    bg = 'black'
                    color = 'white'
                    w = {{base: '95vw', xl: '50vw'}}
                    p = '30px'
                    borderRadius = '12px'
                    mb = '10px'
                    transition = 'all 0.25s ease-in-out'
                    _hover ={{
                        transform: 'scale(1.02)',
                        bg: accentYellow,
                        color: 'black',
                        shadow: 'md'
                    }}
                     _active = {{
                         bg: accentYellow,
                        color: 'black',
                    }}
                    onClick={() => navigate('/signup') }
                >
                    Sign Up
                </Button>
            </VStack>

        </Box>
    </Flex>
  )
}

export default Home