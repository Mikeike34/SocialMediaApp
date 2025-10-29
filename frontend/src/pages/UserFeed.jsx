import MainFeed from '@/components/MainFeed';
import Sidebar from '@/components/Sidebar';
import { Avatar, Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const UserFeed = () => {

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  //colors
  const backgroundYellow = '#fdfce8';
  const green = '#1f574f';
  const accentYellow = '#f6f8b5';
  const pink = '#ee98e0';
  const purple = '#a78dfc';
  const orange = '#f08853';

  return (
    <Flex 
      minH = '100vh' 
      bgColor = {green}
      p = {{base: 2, md: 4, lg: 6}}
    >
        <HStack 
          w = '100%' 
          align = 'stretch' 
          spacing = {{base: 0, md: 4, lg: 6}}
          flexDir = {{base: 'column', xl: 'row'}}
        >

          {/*Navigation*/}
          <Box
            w = {{md: '100px', lg: '150px'}}
            display = 'flex'
            justifyContent = 'center'
          >
            <Sidebar />
          </Box>

          {/*Content area (displays posts)*/}
          <Flex 
            alignItems = 'center'
            minH = '100vh'
            flex = '1'
            mt = {{base: 2, xl: 4}}
            bgColor = {backgroundYellow}
            borderRadius ='12px'
            p = {{base: 2, md: 4}}
            overflow = 'auto'
          >
            <VStack 
              divideY = '2px'
              flexDir = 'column' 
              h = 'full' 
              w = '100%' 
              align = 'stretch'
              spacing = {0}
            >
              {/*Header Section */}
            <Flex 
              h = {{base: '8vh', md: '10vh'}} 
              justify = 'center' 
              align = 'center'
              px = {{base: 2, md: 4}}
            >
              <Heading 
                as = 'h2' 
                color = 'black'
                fontSize = {{base: 'xl', md: '2xl', lg: '3xl'}}
              >
                Feed
              </Heading>
            </Flex>
            {/*Posts*/}
            <Flex 
              justify = 'center'
              px = {{base: 2, md: 4}}
            >
              <MainFeed userID = {userID} token = {token} />
            </Flex>
            </VStack>
          </Flex>
        </HStack>
    </Flex>
  )
}

export default UserFeed;