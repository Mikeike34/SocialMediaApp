import Sidebar from '@/components/Sidebar'
import { Flex } from '@chakra-ui/react'
import React from 'react'

const UserProfile = () => {
  return (
    <Flex minH = '100vh' bgColor = 'gray.600'>
        <Sidebar />

    </Flex>
  )
}

export default UserProfile