import Sidebar from '@/components/Sidebar';
import { Flex, HStack, Text } from '@chakra-ui/react'
import React from 'react'

const UserFeed = () => {
  return (
    <Flex minH = '100vh' bgColor = 'gray.600'>
        <HStack>
          <Sidebar />
        </HStack>
    </Flex>
  )
}

export default UserFeed;