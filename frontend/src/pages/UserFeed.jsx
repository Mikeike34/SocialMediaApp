import MainFeed from '@/components/MainFeed';
import Sidebar from '@/components/Sidebar';
import { Avatar, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const UserFeed = () => {

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  return (
    <Flex minH = '100vh' bgColor = 'gray.600'>
        <HStack w = '100%' align = 'stretch' mr = {5}>
          <Sidebar />
          <Flex 
            alignItems={'center'}
            minH = '100vh'
            flex={'1'}
            mt = {5}
            bgColor = 'white'
            borderRadius={'10px'}
          >
            <VStack divideY={'2px'} flexDir={'column'} h = '95vh' w = '100%' align = 'stretch'>
            <Flex h = '10vh' justify = 'center' align = 'center' >
              <Heading as = 'h2' color = 'black'>Feed</Heading>
            </Flex>
            <Flex justify = 'center' >
              <MainFeed userID = {userID} token = {token} />
            </Flex>
            </VStack>
          </Flex>
        </HStack>
    </Flex>
  )
}

export default UserFeed;