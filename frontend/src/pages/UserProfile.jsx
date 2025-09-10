import Sidebar from '@/components/Sidebar'
import { Avatar, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const UserProfile = () => {
  return (
    <Flex minH = '100vh' bgColor = 'gray.600' w = '100%' padding = {0}>
        <HStack align = 'stretch' w = '100%' mr = {5}>
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
              <Avatar.Root>
                <Avatar.Fallback name = 'Test' />
                <Avatar.Image />
              </Avatar.Root>
              <Flex flexDir = 'column' ml = {2} alignItems = {'center'}>
                <Heading as = 'h2' color = 'black'>Username</Heading>
                <Text color = 'gray'>Test</Text>
              </Flex>
                
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

export default UserProfile