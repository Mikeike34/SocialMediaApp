import Sidebar from '@/components/Sidebar';
import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

const UserFeed = () => {
  return (
    <Flex minH = '100vh' align = 'center' bgColor = 'gray.600'>
        <Sidebar />
    </Flex>
  )
}

export default UserFeed;