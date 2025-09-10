import Sidebar from '@/components/Sidebar';
import { Avatar, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const UserFeed = () => {
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
            borderRadius={'30px'}
          >
            <VStack divideY={'2px'} flexDir={'column'} h = '95vh' w = '100%' align = 'stretch'>
            <Flex h = '10vh' justify = 'center' align = 'center' >
              <Heading as = 'h2' color = 'black'>Posts</Heading>
            </Flex>
            <Flex >
              <Text mt = {10}>User Posts</Text>
            </Flex>

            </VStack>
          </Flex>
        </HStack>
    </Flex>
  )
}

export default UserFeed;